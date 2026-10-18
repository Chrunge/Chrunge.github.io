import React from "react";

export default function SpringBlogHome() {
  return (
    <div className="min-h-screen p-6 font-serif relative debug-border anime-bg">
      <div className="bg-overlay"></div>
      
      <header className="flex flex-col items-center justify-center py-10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md relative">
          春风笔记
          <span className="absolute -top-6 right-0 w-16 h-16 cherry-blossom opacity-60"></span>
        </h1>
        <p className="mt-3 text-lg md:text-xl text-gray-100 italic">"像春风般轻柔的思考"</p>
        <button className="mt-5 px-5 py-2 text-lg rounded-full shadow-md bg-accent hover:bg-accent-hover text-white transition-all">
          探索笔记
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-5 px-3 md:px-12 mt-8 relative z-10">
        <div className="bg-white/90 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow backdrop-blur-sm border-t border-accent/20">
          <div className="relative">
            <h2 className="text-xl font-semibold text-green-700">读书随想</h2>
            <div className="grass-decoration"></div>
          </div>
          <p className="mt-2 text-gray-700 text-sm">
            收集阅读经典与现代作品时的思考，记录那些闪光的瞬间。
          </p>
        </div>
        
        <div className="bg-white/90 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow backdrop-blur-sm border-t border-tertiary/20">
          <div className="relative">
            <h2 className="text-xl font-semibold text-blue-700">技术笔记</h2>
            <div className="cloud-decoration"></div>
          </div>
          <p className="mt-2 text-gray-700 text-sm">
            探索各种技术领域的学习心得，从编程到设计的实践记录。
          </p>
        </div>
        
        <div className="bg-white/90 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow backdrop-blur-sm border-t border-secondary/20">
          <div className="relative">
            <h2 className="text-xl font-semibold text-green-700">生活感悟</h2>
            <div className="leaf-decoration"></div>
          </div>
          <p className="mt-2 text-gray-700 text-sm">
            捕捉日常中的灵感与感悟，像春风拂过湖面留下的涟漪。
          </p>
        </div>
      </main>

      <section className="mt-10 md:mt-16 bg-white/90 rounded-lg p-5 max-w-3xl mx-auto shadow-md backdrop-blur-sm relative z-10">
        <h2 className="text-2xl font-semibold text-green-700 mb-3">最近更新</h2>
        <div className="space-y-3">
          <div className="border-l-2 border-secondary pl-3 hover:bg-green-50/50 transition-colors rounded p-2">
            <h3 className="text-lg font-medium text-gray-800">《人类简史》读后感</h3>
            <p className="text-sm text-gray-600">对历史长河中人类演变的思考，从狩猎采集到人工智能...</p>
            <div className="text-xs text-gray-500 mt-1">2023年4月15日</div>
          </div>
          
          <div className="border-l-2 border-tertiary pl-3 hover:bg-blue-50/50 transition-colors rounded p-2">
            <h3 className="text-lg font-medium text-gray-800">React Hooks最佳实践</h3>
            <p className="text-sm text-gray-600">整理使用React Hooks过程中的经验与技巧...</p>
            <div className="text-xs text-gray-500 mt-1">2023年3月28日</div>
          </div>
          
          <div className="border-l-2 border-accent pl-3 hover:bg-pink-50/50 transition-colors rounded p-2">
            <h3 className="text-lg font-medium text-gray-800">春日小记</h3>
            <p className="text-sm text-gray-600">漫步在樱花盛开的小路，思绪如风般自由...</p>
            <div className="text-xs text-gray-500 mt-1">2023年3月10日</div>
          </div>
        </div>
      </section>

      <footer className="mt-12 text-center text-sm text-white p-4 relative z-10">
        <div className="mb-2">© 2023-2025 春风笔记 | 由热爱与思考驱动</div>
        <div className="flex justify-center space-x-4 text-xs">
          <a href="#" className="hover:text-accent transition-colors">关于</a>
          <a href="#" className="hover:text-accent transition-colors">联系</a>
          <a href="#" className="hover:text-accent transition-colors">RSS</a>
          <a href="#" className="hover:text-accent transition-colors">主题</a>
        </div>
      </footer>

      <style jsx>{`
        .debug-border {
          border: 4px solid red;
        }

        .anime-bg {
          position: relative;
          background: linear-gradient(to bottom, #f1a7a9, #93c5e6);  /* 类似于动漫天空的渐变背景 */
          overflow: hidden;
        }
        
        .anime-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M30,60 Q50,80 70,60 T90,70 T70,80 T50,70 T30,60' stroke='%23ffffff' stroke-width='1' fill='none' stroke-opacity='0.2'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.5;
          z-index: 0;
        }
        
        .anime-bg::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Cpath d='M0,200 L0,150 Q100,100 200,150 Q300,200 400,150 L400,200 Z' fill='%23446b69' fill-opacity='0.3'/%3E%3C/svg%3E");
          background-repeat: repeat-x;
          background-size: 400px 200px;
          z-index: 0;
        }
        
        .bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.3));
          z-index: 1;
        }
        
        .cherry-blossom {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,30 C60,20 70,20 80,30 C90,40 90,50 80,60 C70,70 60,70 50,60 C40,70 30,70 20,60 C10,50 10,40 20,30 C30,20 40,20 50,30 Z' fill='%23f5a3b3' fill-opacity='0.3'/%3E%3Cpath d='M50,30 C55,35 55,45 50,50 C45,45 45,35 50,30 Z M80,30 C75,35 65,35 60,30 C65,25 75,25 80,30 Z M80,60 C75,55 75,45 80,40 C85,45 85,55 80,60 Z M50,60 C45,55 45,45 50,40 C55,45 55,55 50,60 Z M20,60 C25,55 35,55 40,60 C35,65 25,65 20,60 Z M20,30 C25,35 25,45 20,50 C15,45 15,35 20,30 Z' fill='%23ffffff' fill-opacity='0.6'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23ffcc88' fill-opacity='0.7'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
        }
        
        .grass-decoration {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 30px;
          height: 20px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,100 Q25,70 30,100 M15,100 Q20,60 25,100 M25,100 Q35,75 45,100' stroke='%237db069' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          opacity: 0.4;
        }
        
        .cloud-decoration {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 40px;
          height: 20px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='50' viewBox='0 0 100 50'%3E%3Cpath d='M10,40 Q20,20 40,30 Q60,10 80,30 Q90,40 95,35' stroke='%2378a4c7' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          opacity: 0.4;
        }
        
        .leaf-decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 25px;
          height: 25px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,80 Q50,40 80,20 Q60,50 20,80 Z' fill='%237db069' fill-opacity='0.2'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          opacity: 0.5;
        }
        
        .bg-accent {
          background-color: #f5a3b3;
        }
        
        .bg-accent-hover {
          background-color: #e8919f;
        }
        
        .text-accent {
          color: #f5a3b3;
        }
      `}</style>
    </div>
  );
} 