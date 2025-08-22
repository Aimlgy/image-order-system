// 自动部署检测脚本
class AutoDeploy {
    constructor() {
        this.deployOptions = [
            {
                name: 'Netlify',
                url: 'https://app.netlify.com/drop',
                description: '最简单：拖拽文件夹即可',
                difficulty: 1,
                speed: 5,
                stability: 5,
                badge: '推荐'
            },
            {
                name: 'Vercel',
                url: 'https://vercel.com/new',
                description: '最快速：全球边缘网络',
                difficulty: 2,
                speed: 5,
                stability: 5,
                badge: '高性能'
            },
            {
                name: 'GitHub Pages',
                url: 'https://github.com/new',
                description: '最稳定：永久免费托管',
                difficulty: 3,
                speed: 4,
                stability: 5,
                badge: '稳定'
            },
            {
                name: 'Surge.sh',
                url: 'https://surge.sh',
                description: '命令行：开发者友好',
                difficulty: 4,
                speed: 4,
                stability: 4,
                badge: '极客'
            }
        ];
        this.init();
    }

    init() {
        this.createInterface();
        this.bindEvents();
    }

    createInterface() {
        // 如果页面中没有部署容器，创建一个
        if (!document.getElementById('auto-deploy-container')) {
            const container = document.createElement('div');
            container.id = 'auto-deploy-container';
            container.innerHTML = this.generateHTML();
            document.body.appendChild(container);
        }
    }

    generateHTML() {
        return `
            <div class="auto-deploy-modal" id="deployModal" style="display: none;">
                <div class="auto-deploy-content">
                    <div class="deploy-header">
                        <h2>🚀 获得永久网络链接</h2>
                        <span class="close-btn" onclick="closeDeploy()">&times;</span>
                    </div>
                    
                    <div class="deploy-intro">
                        <p>选择一个部署平台，让全世界都能访问您的系统！</p>
                    </div>

                    <div class="deploy-options">
                        ${this.deployOptions.map((option, index) => `
                            <div class="deploy-option" data-index="${index}">
                                <div class="option-badge">${option.badge}</div>
                                <div class="option-header">
                                    <h3>${option.name}</h3>
                                    <div class="rating">
                                        <span class="rating-item">
                                            简单度: ${'★'.repeat(6-option.difficulty)}${'☆'.repeat(option.difficulty-1)}
                                        </span>
                                        <span class="rating-item">
                                            速度: ${'★'.repeat(option.speed)}
                                        </span>
                                    </div>
                                </div>
                                <p class="option-desc">${option.description}</p>
                                <button class="deploy-btn" onclick="openDeployPlatform('${option.url}', '${option.name}')">
                                    立即部署
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="deploy-help">
                        <h3>📋 部署后您将获得：</h3>
                        <ul>
                            <li>✅ 永久访问链接（如：https://your-app.netlify.app）</li>
                            <li>✅ 全球任何地方都能访问</li>
                            <li>✅ 支持手机、平板、电脑</li>
                            <li>✅ 自动HTTPS安全访问</li>
                            <li>✅ 完全免费，无时间限制</li>
                        </ul>
                    </div>
                </div>
            </div>

            <style>
            .auto-deploy-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .auto-deploy-content {
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease;
            }

            .deploy-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }

            .deploy-header h2 {
                color: #667eea;
                margin: 0;
            }

            .close-btn {
                font-size: 30px;
                cursor: pointer;
                color: #999;
                line-height: 1;
            }

            .close-btn:hover {
                color: #333;
            }

            .deploy-intro {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
            }

            .deploy-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .deploy-option {
                border: 2px solid #e1e8ed;
                border-radius: 12px;
                padding: 20px;
                position: relative;
                transition: all 0.3s ease;
                background: #f8f9ff;
            }

            .deploy-option:hover {
                border-color: #667eea;
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
            }

            .option-badge {
                position: absolute;
                top: -10px;
                right: 15px;
                background: #667eea;
                color: white;
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
            }

            .option-header h3 {
                color: #333;
                margin: 0 0 10px 0;
                font-size: 20px;
            }

            .rating {
                display: flex;
                flex-direction: column;
                gap: 5px;
                margin-bottom: 15px;
            }

            .rating-item {
                font-size: 12px;
                color: #666;
            }

            .option-desc {
                color: #666;
                margin-bottom: 20px;
                line-height: 1.5;
            }

            .deploy-btn {
                width: 100%;
                padding: 12px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .deploy-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }

            .deploy-help {
                background: #f0f8ff;
                padding: 20px;
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }

            .deploy-help h3 {
                color: #333;
                margin-top: 0;
            }

            .deploy-help ul {
                margin: 15px 0;
                padding-left: 20px;
            }

            .deploy-help li {
                margin: 8px 0;
                color: #555;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from { transform: translateY(-30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @media (max-width: 768px) {
                .auto-deploy-content {
                    margin: 20px;
                    padding: 20px;
                }
                
                .deploy-options {
                    grid-template-columns: 1fr;
                }
            }
            </style>
        `;
    }

    bindEvents() {
        // 绑定事件处理程序
        window.showDeployModal = () => {
            document.getElementById('deployModal').style.display = 'flex';
        };

        window.closeDeploy = () => {
            document.getElementById('deployModal').style.display = 'none';
        };

        window.openDeployPlatform = (url, platform) => {
            // 显示部署指导
            this.showDeployGuide(platform);
            // 打开部署平台
            window.open(url, '_blank');
        };

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.closeDeploy();
            }
        });

        // 点击背景关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auto-deploy-modal')) {
                window.closeDeploy();
            }
        });
    }

    showDeployGuide(platform) {
        const guides = {
            'Netlify': '将整个 xitong 文件夹拖拽到 Netlify 页面的虚线框内，等待部署完成即可！',
            'Vercel': '选择导入项目，或直接拖拽文件夹到 Vercel 页面，自动完成部署！',
            'GitHub Pages': '1. 创建新仓库 2. 上传所有文件 3. 在Settings→Pages中启用 4. 获得链接！',
            'Surge.sh': '在命令行中运行：npm install -g surge，然后在项目文件夹中运行：surge'
        };

        const guide = guides[platform] || '请按照平台指引完成部署。';
        
        // 显示引导提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10001;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        toast.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 20px;">🚀</span>
                <div>
                    <strong>${platform} 部署指南：</strong><br>
                    <small>${guide}</small>
                </div>
            </div>
        `;

        document.body.appendChild(toast);

        // 5秒后自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 8000);
    }

    // 检测用户环境并推荐最佳方案
    recommendBestOption() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isChina = navigator.language.includes('zh');
        
        let recommended = 0; // 默认推荐 Netlify

        if (isMobile) {
            // 移动端推荐更简单的方案
            recommended = 0; // Netlify
        } else if (isChina) {
            // 中国用户可能更适合 GitHub Pages
            recommended = 2; // GitHub Pages
        }

        return this.deployOptions[recommended];
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const autoDeploy = new AutoDeploy();
    
    // 添加全局快捷按钮（如果页面中没有的话）
    if (!document.querySelector('.deploy-quick-btn')) {
        const quickBtn = document.createElement('div');
        quickBtn.className = 'deploy-quick-btn';
        quickBtn.innerHTML = '🌐 获得网络链接';
        quickBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            z-index: 1000;
            font-weight: 500;
            transition: all 0.3s ease;
        `;
        quickBtn.onclick = () => window.showDeployModal();
        
        quickBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        });
        
        quickBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        });
        
        document.body.appendChild(quickBtn);
    }
});

// 添加样式动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
