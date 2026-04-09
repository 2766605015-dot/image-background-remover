export async function onRequestPost(context) {
  const request = context.request;
  
  const apiKey = context.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: '服务器配置错误：缺少 remove.bg API Key' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: '请上传图片文件' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', image);
    removeBgFormData.append('size', 'auto');
    
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });
    
    if (!removeBgResponse.ok) {
      const errorData = await removeBgResponse.json().catch(() => ({}));
      
      if (removeBgResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: '免费额度已用完，请联系管理员' }),
          { 
            status: 402,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorData.errors?.[0]?.title || '图片处理失败，请重试' 
        }),
        { 
          status: removeBgResponse.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const processedImage = await removeBgResponse.blob();
    
    return new Response(processedImage, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
        'Cache-Control': 'no-store',
      },
    });
    
  } catch (err) {
    console.error('Error processing image:', err);
    return new Response(
      JSON.stringify({ error: '服务器错误，请稍后重试' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: '仅支持 POST 请求' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return onRequestPost(context);
}
