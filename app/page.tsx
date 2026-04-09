'use client'

import { useState, useRef } from 'react'

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // 校验文件类型
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setError('请上传 JPG 或 PNG 格式的图片')
      return
    }

    // 校验文件大小 (25MB)
    if (file.size > 25 * 1024 * 1024) {
      setError('图片大小不能超过 25MB')
      return
    }

    setError(null)
    
    // 显示原图预览
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // 上传并处理
    uploadAndProcess(file)
  }

  const uploadAndProcess = async (file: File) => {
    setIsProcessing(true)
    setProcessedImage(null)

    try {
      const formData = new FormData()
      formData.append('image_file', file)
      formData.append('size', 'auto')

      const response = await fetch('/api/remove', {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY || '',
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.errors?.[0]?.title || '处理失败，请重试')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setProcessedImage(url)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : '网络错误，请检查连接后重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDownload = () => {
    if (!processedImage) return
    
    const a = document.createElement('a')
    a.href = processedImage
    a.download = 'removed-bg.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setOriginalImage(null)
    setProcessedImage(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎨 Image Background Remover
          </h1>
          <p className="text-xl opacity-90">
            一键移除图片背景，5 秒搞定抠图
          </p>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Upload Area */}
          {!originalImage && !isProcessing && (
            <div
              className="border-4 border-dashed border-primary-500 rounded-xl p-16 text-center cursor-pointer hover:border-secondary-500 hover:bg-primary-50 transition-all m-6"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <svg
                  className="w-20 h-20 mx-auto text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-xl text-gray-700">
                  拖拽图片到此处 或 <span className="text-primary-500 underline">点击上传</span>
                </p>
                <p className="text-sm text-gray-500">支持 JPG/PNG，最大 25MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="p-16 text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">正在移除背景...</p>
            </div>
          )}

          {/* Result */}
          {originalImage && processedImage && !isProcessing && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">处理完成！</h2>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 border-2 border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                >
                  再处理一张
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">原图</p>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">去背后</p>
                  <div className="checkerboard rounded-lg overflow-hidden shadow-md">
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                ⬇️ 下载透明背景图片
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-16 text-center">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 mb-6">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                重试
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-white mt-8 opacity-80 text-sm">
          <p>Powered by Next.js + remove.bg API</p>
        </footer>
      </div>
    </div>
  )
}
