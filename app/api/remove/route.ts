import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image_file')

    if (!image) {
      return NextResponse.json(
        { errors: [{ title: '请上传图片文件' }] },
        { status: 400 }
      )
    }

    // 转发到 remove.bg API
    const removeBgFormData = new FormData()
    removeBgFormData.append('image_file', image)
    removeBgFormData.append('size', 'auto')

    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { errors: [{ title: '服务器配置错误：缺少 remove.bg API Key' }] },
        { status: 500 }
      )
    }

    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    })

    // 处理 remove.bg 返回的错误
    if (!removeBgResponse.ok) {
      const errorData = await removeBgResponse.json().catch(() => ({}))
      
      // 额度用完
      if (removeBgResponse.status === 402) {
        return NextResponse.json(
          { errors: [{ title: '免费额度已用完' }] },
          { status: 402 }
        )
      }

      return NextResponse.json(
        { errors: [errorData.errors?.[0] || { title: '图片处理失败，请重试' }] },
        { status: removeBgResponse.status }
      )
    }

    // 获取处理后的图片
    const processedImage = await removeBgResponse.blob()

    // 返回图片
    return new NextResponse(processedImage, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
        'Cache-Control': 'no-store',
      },
    })

  } catch (err) {
    console.error('Error processing image:', err)
    return NextResponse.json(
      { errors: [{ title: '服务器错误，请稍后重试' }] },
      { status: 500 }
    )
  }
}
