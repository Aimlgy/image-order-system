// 图片查单及排单系统 - 主应用逻辑
class ImageOrderSystem {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
        this.showLoginForm();
    }

    // 绑定事件监听器
    bindEvents() {
        // 登录表单
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // 退出登录
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // 导航菜单
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.switchPage(page);
            });
        });

        // 样品表单
        document.getElementById('addSampleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSample();
        });

        // 需求表单
        document.getElementById('requestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitRequest();
        });

        // 上传表单
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadImages();
        });

        // 文件选择预览
        document.getElementById('referenceImages').addEventListener('change', (e) => {
            this.previewImages(e.target.files, 'imagePreview');
        });

        // 任务状态过滤
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterTasks(btn.dataset.status);
            });
        });

        // 搜索功能
        document.getElementById('sampleSearch').addEventListener('input', (e) => {
            this.searchSamples(e.target.value);
        });

        document.getElementById('imageSearch').addEventListener('input', (e) => {
            this.searchImages(e.target.value);
        });
    }

    // 显示登录表单
    showLoginForm() {
        document.getElementById('loginContainer').classList.remove('hidden');
        document.getElementById('mainContainer').classList.add('hidden');
    }

    // 处理登录
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('userRole').value;

        // 简单的登录验证（实际项目中应该连接后端API）
        if (username && password && role) {
            this.currentUser = username;
            this.currentRole = role;
            
            // 更新用户信息显示
            document.getElementById('currentUser').textContent = username;
            document.getElementById('currentRole').textContent = this.getRoleDisplayName(role);
            
            // 显示主界面
            document.getElementById('loginContainer').classList.add('hidden');
            document.getElementById('mainContainer').classList.remove('hidden');
            
            // 根据角色权限调整界面
            this.adjustInterfaceByRole();
            
            // 加载数据
            this.loadDashboardData();
            
            this.showToast('登录成功！', 'success');
        } else {
            this.showToast('请填写完整的登录信息', 'error');
        }
    }

    // 处理退出登录
    handleLogout() {
        this.currentUser = null;
        this.currentRole = null;
        this.showLoginForm();
        this.showToast('已退出登录', 'success');
    }

    // 获取角色显示名称
    getRoleDisplayName(role) {
        const roleNames = {
            admin: '管理员',
            operator: '运营',
            assistant: '助理',
            designer: '美工'
        };
        return roleNames[role] || role;
    }

    // 根据角色调整界面
    adjustInterfaceByRole() {
        const navItems = document.querySelectorAll('.nav-item');
        
        // 根据角色隐藏或显示某些功能
        if (this.currentRole === 'designer') {
            // 美工只能看到任务管理、图片库和进度看板
            navItems.forEach(item => {
                const page = item.dataset.page;
                if (['samples', 'requests', 'reports'].includes(page)) {
                    item.style.display = 'none';
                }
            });
        } else if (this.currentRole === 'assistant') {
            // 助理不能看到统计报表
            navItems.forEach(item => {
                const page = item.dataset.page;
                if (page === 'reports') {
                    item.style.display = 'none';
                }
            });
        }
    }

    // 切换页面
    switchPage(pageName) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // 显示对应页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageName).classList.add('active');

        this.currentPage = pageName;

        // 加载页面数据
        this.loadPageData(pageName);
    }

    // 加载页面数据
    loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'samples':
                this.loadSamples();
                break;
            case 'requests':
                this.loadRequestForm();
                break;
            case 'tasks':
                this.loadTasks();
                break;
            case 'images':
                this.loadImages();
                break;
            case 'approval':
                this.loadApprovals();
                break;
            case 'board':
                this.loadKanbanBoard();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
    }

    // 加载工作台数据
    loadDashboardData() {
        const data = DataManager.getDashboardStats();
        
        document.getElementById('totalSamples').textContent = data.totalSamples;
        document.getElementById('pendingTasks').textContent = data.pendingTasks;
        document.getElementById('inProgressTasks').textContent = data.inProgressTasks;
        document.getElementById('completedTasks').textContent = data.completedTasks;

        this.loadRecentActivity();
    }

    // 加载最近活动
    loadRecentActivity() {
        const activities = DataManager.getRecentActivities();
        const activityList = document.getElementById('activityList');
        
        if (activities.length === 0) {
            activityList.innerHTML = '<div class="empty-state"><i class="fas fa-clock"></i><h3>暂无活动记录</h3></div>';
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <span>${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    // 加载样品数据
    loadSamples() {
        const samples = DataManager.getSamples();
        const tbody = document.getElementById('samplesTableBody');
        
        if (samples.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">暂无样品数据</td></tr>';
            return;
        }

        tbody.innerHTML = samples.map(sample => `
            <tr>
                <td>${sample.code}</td>
                <td>${sample.owner}</td>
                <td>${sample.location}</td>
                <td><span class="status-badge status-${sample.status.toLowerCase()}">${sample.status}</span></td>
                <td>${sample.createTime}</td>
                <td>
                    <button class="action-button btn-edit" onclick="editSample('${sample.id}')">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="action-button btn-delete" onclick="deleteSample('${sample.id}')">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // 搜索样品
    searchSamples(keyword) {
        const samples = DataManager.searchSamples(keyword);
        const tbody = document.getElementById('samplesTableBody');
        
        tbody.innerHTML = samples.map(sample => `
            <tr>
                <td>${sample.code}</td>
                <td>${sample.owner}</td>
                <td>${sample.location}</td>
                <td><span class="status-badge status-${sample.status.toLowerCase()}">${sample.status}</span></td>
                <td>${sample.createTime}</td>
                <td>
                    <button class="action-button btn-edit" onclick="editSample('${sample.id}')">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="action-button btn-delete" onclick="deleteSample('${sample.id}')">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // 添加样品
    addSample() {
        const formData = {
            code: document.getElementById('sampleCode').value,
            owner: document.getElementById('sampleOwner').value,
            location: document.getElementById('sampleLocation').value,
            status: document.getElementById('sampleStatus').value
        };

        if (DataManager.addSample(formData)) {
            this.showToast('样品添加成功！', 'success');
            this.closeModal('addSampleModal');
            this.loadSamples();
            this.loadDashboardData();
            document.getElementById('addSampleForm').reset();
        } else {
            this.showToast('样品编号已存在！', 'error');
        }
    }

    // 加载需求表单
    loadRequestForm() {
        const samples = DataManager.getSamples();
        const sampleSelect = document.getElementById('relatedSample');
        
        sampleSelect.innerHTML = '<option value="">选择样品</option>' + 
            samples.map(sample => `<option value="${sample.id}">${sample.code} - ${sample.owner}</option>`).join('');
    }

    // 提交需求
    submitRequest() {
        const formData = {
            relatedSample: document.getElementById('relatedSample').value,
            deadline: document.getElementById('deadline').value,
            imageSpec: document.getElementById('imageSpec').value,
            priority: document.getElementById('priority').value,
            copyContent: document.getElementById('copyContent').value,
            imageRequirement: document.getElementById('imageRequirement').value,
            remarks: document.getElementById('remarks').value,
            creator: this.currentUser
        };

        if (DataManager.addRequest(formData)) {
            this.showToast('需求提交成功！', 'success');
            document.getElementById('requestForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            this.loadDashboardData();
        } else {
            this.showToast('提交失败，请检查表单！', 'error');
        }
    }

    // 图片预览
    previewImages(files, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="预览图">
                        <button type="button" class="preview-remove" onclick="this.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    container.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 加载任务数据
    loadTasks() {
        const tasks = DataManager.getTasks();
        this.renderTasks(tasks);
    }

    // 渲染任务表格
    renderTasks(tasks) {
        const tbody = document.getElementById('tasksTableBody');
        
        if (tasks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">暂无任务数据</td></tr>';
            return;
        }

        tbody.innerHTML = tasks.map(task => `
            <tr>
                <td>${task.id}</td>
                <td>${task.sampleCode}</td>
                <td>${task.type}</td>
                <td>${task.assignee || '未分配'}</td>
                <td><span class="status-badge status-${task.status}">${this.getStatusDisplayName(task.status)}</span></td>
                <td><span class="priority-${task.priority}">${task.priority}</span></td>
                <td>${task.deadline}</td>
                <td>
                    <button class="action-button btn-view" onclick="viewTask('${task.id}')">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                    ${this.canEditTask(task) ? `
                        <button class="action-button btn-edit" onclick="editTask('${task.id}')">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    // 获取状态显示名称
    getStatusDisplayName(status) {
        const statusNames = {
            pending: '待拍摄',
            shooting: '拍摄中',
            processing: '制作中',
            review: '审核中',
            completed: '已完成'
        };
        return statusNames[status] || status;
    }

    // 检查是否可以编辑任务
    canEditTask(task) {
        if (this.currentRole === 'admin') return true;
        if (this.currentRole === 'operator') return true;
        if (this.currentRole === 'designer' && ['shooting', 'processing'].includes(task.status)) return true;
        return false;
    }

    // 过滤任务
    filterTasks(status) {
        // 更新过滤按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"]`).classList.add('active');

        // 过滤并显示任务
        const tasks = status === 'all' ? DataManager.getTasks() : DataManager.getTasksByStatus(status);
        this.renderTasks(tasks);
    }

    // 加载图片库
    loadImages() {
        const images = DataManager.getImages();
        const gallery = document.getElementById('imageGallery');
        
        if (images.length === 0) {
            gallery.innerHTML = '<div class="empty-state"><i class="fas fa-images"></i><h3>暂无图片</h3></div>';
            return;
        }

        gallery.innerHTML = images.map(image => `
            <div class="image-item">
                <img src="${image.url}" alt="${image.name}" class="image-thumbnail">
                <div class="image-info">
                    <div class="image-title">${image.name}</div>
                    <div class="image-meta">
                        <span>${image.category}</span> | 
                        <span>${image.uploadTime}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 搜索图片
    searchImages(keyword) {
        const images = DataManager.searchImages(keyword);
        const gallery = document.getElementById('imageGallery');
        
        gallery.innerHTML = images.map(image => `
            <div class="image-item">
                <img src="${image.url}" alt="${image.name}" class="image-thumbnail">
                <div class="image-info">
                    <div class="image-title">${image.name}</div>
                    <div class="image-meta">
                        <span>${image.category}</span> | 
                        <span>${image.uploadTime}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 上传图片
    uploadImages() {
        const files = document.getElementById('uploadFiles').files;
        const category = document.getElementById('uploadCategory').value;
        const relatedTask = document.getElementById('relatedTask').value;

        if (files.length === 0) {
            this.showToast('请选择要上传的图片！', 'error');
            return;
        }

        // 模拟上传过程
        Array.from(files).forEach((file, index) => {
            const imageData = {
                name: file.name,
                category: category,
                relatedTask: relatedTask,
                uploader: this.currentUser
            };
            
            DataManager.addImage(imageData);
        });

        this.showToast(`成功上传 ${files.length} 张图片！`, 'success');
        this.closeModal('uploadModal');
        this.loadImages();
        document.getElementById('uploadForm').reset();
    }

    // 加载审核中心
    loadApprovals() {
        const approvals = DataManager.getApprovalsForRole(this.currentRole);
        const approvalList = document.getElementById('approvalList');
        
        if (approvals.length === 0) {
            approvalList.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><h3>暂无待审核项目</h3></div>';
            return;
        }

        approvalList.innerHTML = approvals.map(approval => `
            <div class="approval-item">
                <div class="approval-header">
                    <div class="approval-title">${approval.title}</div>
                    <span class="status-badge status-${approval.status}">${approval.status}</span>
                </div>
                <div class="approval-content">
                    <div class="approval-details">
                        <p><strong>样品编号：</strong>${approval.sampleCode}</p>
                        <p><strong>需求描述：</strong>${approval.description}</p>
                        <p><strong>提交人：</strong>${approval.creator}</p>
                        <p><strong>提交时间：</strong>${approval.createTime}</p>
                    </div>
                    <div class="approval-images">
                        ${approval.images.map(img => `
                            <img src="${img}" alt="审核图片" class="approval-image">
                        `).join('')}
                    </div>
                </div>
                <div class="approval-actions">
                    <button class="btn-primary btn-approve" onclick="approveItem('${approval.id}')">
                        <i class="fas fa-check"></i> 通过
                    </button>
                    <button class="btn-primary btn-reject" onclick="rejectItem('${approval.id}')">
                        <i class="fas fa-times"></i> 拒绝
                    </button>
                    <button class="btn-secondary" onclick="viewApprovalDetails('${approval.id}')">
                        <i class="fas fa-eye"></i> 详情
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 加载看板数据
    loadKanbanBoard() {
        const tasks = DataManager.getTasks();
        const statusCounts = {};
        
        // 统计各状态任务数量
        ['pending', 'shooting', 'processing', 'review', 'completed'].forEach(status => {
            const statusTasks = tasks.filter(task => task.status === status);
            statusCounts[status] = statusTasks.length;
            
            // 更新计数显示
            const countElement = document.getElementById(`${status}Count`);
            if (countElement) {
                countElement.textContent = statusTasks.length;
            }
            
            // 更新看板卡片
            const cardsContainer = document.getElementById(`${status}Cards`);
            if (cardsContainer) {
                cardsContainer.innerHTML = statusTasks.map(task => `
                    <div class="kanban-card" onclick="viewTask('${task.id}')">
                        <div class="card-title">${task.sampleCode}</div>
                        <div class="card-meta">
                            <span>${task.type}</span>
                            <span>${task.deadline}</span>
                        </div>
                    </div>
                `).join('');
            }
        });
    }

    // 加载报表
    loadReports() {
        // 这里可以集成图表库如Chart.js来显示报表
        console.log('加载报表数据...');
    }

    // 显示模态框
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    // 关闭模态框
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // 显示提示消息
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : 'fa-exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // 加载初始数据
    loadInitialData() {
        // 初始化示例数据
        DataManager.initSampleData();
    }
}

// 全局函数
window.switchPage = function(pageName) {
    app.switchPage(pageName);
};

window.showAddSampleModal = function() {
    app.showModal('addSampleModal');
};

window.showUploadModal = function() {
    app.showModal('uploadModal');
    // 加载相关任务选项
    const tasks = DataManager.getTasks();
    const taskSelect = document.getElementById('relatedTask');
    taskSelect.innerHTML = '<option value="">选择任务</option>' + 
        tasks.map(task => `<option value="${task.id}">${task.id} - ${task.sampleCode}</option>`).join('');
};

window.closeModal = function(modalId) {
    app.closeModal(modalId);
};

window.editSample = function(sampleId) {
    console.log('编辑样品:', sampleId);
    // 实现编辑样品功能
};

window.deleteSample = function(sampleId) {
    if (confirm('确定要删除这个样品吗？')) {
        DataManager.deleteSample(sampleId);
        app.loadSamples();
        app.loadDashboardData();
        app.showToast('样品已删除', 'success');
    }
};

window.viewTask = function(taskId) {
    console.log('查看任务:', taskId);
    // 实现查看任务详情功能
};

window.editTask = function(taskId) {
    console.log('编辑任务:', taskId);
    // 实现编辑任务功能
};

window.approveItem = function(approvalId) {
    DataManager.approveItem(approvalId);
    app.loadApprovals();
    app.showToast('审核通过！', 'success');
};

window.rejectItem = function(approvalId) {
    const reason = prompt('请输入拒绝原因：');
    if (reason) {
        DataManager.rejectItem(approvalId, reason);
        app.loadApprovals();
        app.showToast('已拒绝审核', 'warning');
    }
};

window.viewApprovalDetails = function(approvalId) {
    console.log('查看审核详情:', approvalId);
    // 实现查看审核详情功能
};

window.searchSamples = function() {
    const keyword = document.getElementById('sampleSearch').value;
    app.searchSamples(keyword);
};

window.searchImages = function() {
    const keyword = document.getElementById('imageSearch').value;
    app.searchImages(keyword);
};

window.generateReport = function() {
    console.log('生成报表');
    app.showToast('报表生成中...', 'success');
};

window.exportReport = function() {
    console.log('导出报表');
    app.showToast('报表导出中...', 'success');
};

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new ImageOrderSystem();
});
