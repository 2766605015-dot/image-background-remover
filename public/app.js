const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const processing = document.getElementById('processing');
const result = document.getElementById('result');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const retryBtn = document.getElementById('retryBtn');

let currentFile = null;
let processedBlob = null;

function init() {
  uploadArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleDrop);
  resetBtn.addEventListener('click', reset);
  retryBtn.addEventListener('click', reset);
  downloadBtn.addEventListener('click', downloadImage);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

function handleDragOver(e) {
  e.preventDefault();
  uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
    showError('请上传 JPG 或 PNG 格式的图片');
    return;
  }
  
  if (file.size > 25 * 1024 * 1024) {
    showError('图片大小不能超过 25MB');
    return;
  }
  
  currentFile = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
  
  uploadAndProcess(file);
}

async function uploadAndProcess(file) {
  uploadArea.style.display = 'none';
  processing.style.display = 'block';
  error.style.display = 'none';
  
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/remove', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || '处理失败，请重试');
    }
    
    processedBlob = await response.blob();
    const url = URL.createObjectURL(processedBlob);
    processedImage.src = url;
    
    processing.style.display = 'none';
    result.style.display = 'block';
    
  } catch (err) {
    console.error('Error:', err);
    processing.style.display = 'none';
    showError(err.message || '网络错误，请检查连接后重试');
  }
}

function showError(message) {
  uploadArea.style.display = 'none';
  processing.style.display = 'none';
  error.style.display = 'block';
  errorMessage.textContent = message;
}

function reset() {
  currentFile = null;
  processedBlob = null;
  fileInput.value = '';
  originalImage.src = '';
  processedImage.src = '';
  
  uploadArea.style.display = 'block';
  processing.style.display = 'none';
  result.style.display = 'none';
  error.style.display = 'none';
}

function downloadImage() {
  if (!processedBlob) return;
  
  const url = URL.createObjectURL(processedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'removed-bg.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

init();
