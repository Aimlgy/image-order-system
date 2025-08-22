// 数据管理模块
class DataManager {
    static init() {
        // 初始化本地存储数据结构
        if (!localStorage.getItem('imageOrderSystem')) {
            localStorage.setItem('imageOrderSystem', JSON.stringify({
                samples: [],
                requests: [],
                tasks: [],
                images: [],
                approvals: [],
                activities: []
            }));
        }
    }

    static getData() {
        const data = localStorage.getItem('imageOrderSystem');
        return data ? JSON.parse(data) : {
            samples: [],
            requests: [],
            tasks: [],
            images: [],
            approvals: [],
            activities: []
        };
    }

    static saveData(data) {
        localStorage.setItem('imageOrderSystem', JSON.stringify(data));
    }

    // 生成唯一ID
    static generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // 获取当前时间字符串
    static getCurrentTime() {
        return new Date().toLocaleString('zh-CN');
    }

    // 样品管理
    static getSamples() {
        return this.getData().samples;
    }

    static addSample(sampleData) {
        const data = this.getData();
        
        // 检查样品编号是否已存在
        if (data.samples.some(sample => sample.code === sampleData.code)) {
            return false;
        }

        const newSample = {
            id: this.generateId(),
            ...sampleData,
            createTime: this.getCurrentTime()
        };

        data.samples.push(newSample);
        this.saveData(data);

        // 添加活动记录
        this.addActivity({
            type: 'sample_added',
            description: `新增样品：${sampleData.code}`,
            icon: 'fas fa-plus'
        });

        return true;
    }

    static deleteSample(sampleId) {
        const data = this.getData();
        const sampleIndex = data.samples.findIndex(sample => sample.id === sampleId);
        
        if (sampleIndex !== -1) {
            const sample = data.samples[sampleIndex];
            data.samples.splice(sampleIndex, 1);
            this.saveData(data);

            // 添加活动记录
            this.addActivity({
                type: 'sample_deleted',
                description: `删除样品：${sample.code}`,
                icon: 'fas fa-trash'
            });

            return true;
        }
        return false;
    }

    static searchSamples(keyword) {
        const samples = this.getSamples();
        if (!keyword) return samples;
        
        return samples.filter(sample => 
            sample.code.toLowerCase().includes(keyword.toLowerCase()) ||
            sample.owner.toLowerCase().includes(keyword.toLowerCase()) ||
            sample.location.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    // 需求管理
    static getRequests() {
        return this.getData().requests;
    }

    static addRequest(requestData) {
        const data = this.getData();
        
        const newRequest = {
            id: this.generateId(),
            ...requestData,
            status: 'pending',
            createTime: this.getCurrentTime()
        };

        data.requests.push(newRequest);

        // 同时创建对应的任务
        const newTask = {
            id: this.generateId(),
            requestId: newRequest.id,
            sampleCode: this.getSampleCode(requestData.relatedSample),
            type: requestData.imageSpec,
            status: 'pending',
            priority: requestData.priority,
            deadline: requestData.deadline,
            creator: requestData.creator,
            createTime: this.getCurrentTime()
        };

        data.tasks.push(newTask);
        this.saveData(data);

        // 添加活动记录
        this.addActivity({
            type: 'request_submitted',
            description: `提交图片需求：${newTask.sampleCode}`,
            icon: 'fas fa-edit'
        });

        return true;
    }

    static getSampleCode(sampleId) {
        const samples = this.getSamples();
        const sample = samples.find(s => s.id === sampleId);
        return sample ? sample.code : '未知样品';
    }

    // 任务管理
    static getTasks() {
        return this.getData().tasks;
    }

    static getTasksByStatus(status) {
        return this.getTasks().filter(task => task.status === status);
    }

    static updateTaskStatus(taskId, newStatus) {
        const data = this.getData();
        const task = data.tasks.find(t => t.id === taskId);
        
        if (task) {
            const oldStatus = task.status;
            task.status = newStatus;
            task.updateTime = this.getCurrentTime();
            this.saveData(data);

            // 添加活动记录
            this.addActivity({
                type: 'task_status_changed',
                description: `任务状态变更：${task.sampleCode} (${oldStatus} → ${newStatus})`,
                icon: 'fas fa-exchange-alt'
            });

            return true;
        }
        return false;
    }

    // 图片管理
    static getImages() {
        return this.getData().images;
    }

    static addImage(imageData) {
        const data = this.getData();
        
        const newImage = {
            id: this.generateId(),
            ...imageData,
            url: this.generateDummyImageUrl(), // 生成示例图片URL
            uploadTime: this.getCurrentTime()
        };

        data.images.push(newImage);
        this.saveData(data);

        // 添加活动记录
        this.addActivity({
            type: 'image_uploaded',
            description: `上传图片：${imageData.name}`,
            icon: 'fas fa-upload'
        });

        return true;
    }

    static generateDummyImageUrl() {
        const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'F9CA24', 'F0932B', 'EB4D4B', '6C5CE7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `https://via.placeholder.com/300x200/${color}/FFFFFF?text=Sample+Image`;
    }

    static searchImages(keyword) {
        const images = this.getImages();
        if (!keyword) return images;
        
        return images.filter(image => 
            image.name.toLowerCase().includes(keyword.toLowerCase()) ||
            image.category.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    // 审核管理
    static getApprovals() {
        return this.getData().approvals;
    }

    static getApprovalsForRole(role) {
        const approvals = this.getApprovals();
        
        // 根据角色过滤审核项目
        switch (role) {
            case 'operator':
                return approvals.filter(approval => approval.approverRole === 'operator');
            case 'assistant':
                return approvals.filter(approval => approval.approverRole === 'assistant');
            default:
                return approvals;
        }
    }

    static approveItem(approvalId) {
        const data = this.getData();
        const approval = data.approvals.find(a => a.id === approvalId);
        
        if (approval) {
            approval.status = 'approved';
            approval.approveTime = this.getCurrentTime();
            this.saveData(data);

            // 更新相关任务状态
            if (approval.relatedTaskId) {
                this.updateTaskStatus(approval.relatedTaskId, 'completed');
            }

            return true;
        }
        return false;
    }

    static rejectItem(approvalId, reason) {
        const data = this.getData();
        const approval = data.approvals.find(a => a.id === approvalId);
        
        if (approval) {
            approval.status = 'rejected';
            approval.rejectReason = reason;
            approval.rejectTime = this.getCurrentTime();
            this.saveData(data);

            // 更新相关任务状态
            if (approval.relatedTaskId) {
                this.updateTaskStatus(approval.relatedTaskId, 'pending');
            }

            return true;
        }
        return false;
    }

    // 活动记录管理
    static getRecentActivities(limit = 10) {
        const activities = this.getData().activities;
        return activities.slice(-limit).reverse(); // 返回最近的活动，倒序排列
    }

    static addActivity(activityData) {
        const data = this.getData();
        
        const newActivity = {
            id: this.generateId(),
            ...activityData,
            time: this.getCurrentTime()
        };

        data.activities.push(newActivity);
        
        // 只保留最近100条活动记录
        if (data.activities.length > 100) {
            data.activities = data.activities.slice(-100);
        }
        
        this.saveData(data);
    }

    // 统计数据
    static getDashboardStats() {
        const data = this.getData();
        
        return {
            totalSamples: data.samples.length,
            pendingTasks: data.tasks.filter(task => task.status === 'pending').length,
            inProgressTasks: data.tasks.filter(task => ['shooting', 'processing'].includes(task.status)).length,
            completedTasks: data.tasks.filter(task => task.status === 'completed').length
        };
    }

    // 初始化示例数据
    static initSampleData() {
        this.init();
        const data = this.getData();
        
        // 如果已有数据，不重复初始化
        if (data.samples.length > 0) return;

        // 添加示例样品
        const sampleSamples = [
            {
                code: 'SP001',
                owner: '张三',
                location: 'A区-01货架',
                status: '已确认'
            },
            {
                code: 'SP002',
                owner: '李四',
                location: 'A区-02货架',
                status: '未确认'
            },
            {
                code: 'SP003',
                owner: '王五',
                location: 'B区-01货架',
                status: '已使用'
            },
            {
                code: 'SP004',
                owner: '赵六',
                location: 'B区-02货架',
                status: '已确认'
            },
            {
                code: 'SP005',
                owner: '钱七',
                location: 'C区-01货架',
                status: '未确认'
            }
        ];

        sampleSamples.forEach(sample => {
            this.addSample(sample);
        });

        // 添加示例需求和任务
        const sampleRequests = [
            {
                relatedSample: data.samples[0].id,
                deadline: '2024-01-20',
                imageSpec: '主图',
                priority: '紧急',
                copyContent: '这是一个高质量的产品，适合日常使用...',
                imageRequirement: '需要白底主图，突出产品特色...',
                remarks: '请尽快完成',
                creator: 'admin'
            },
            {
                relatedSample: data.samples[1].id,
                deadline: '2024-01-25',
                imageSpec: '详情图',
                priority: '普通',
                copyContent: '产品详细介绍文案...',
                imageRequirement: '需要场景图和细节图...',
                remarks: '',
                creator: 'admin'
            }
        ];

        sampleRequests.forEach(request => {
            this.addRequest(request);
        });

        // 更新任务状态以创建多样化的看板数据
        const tasks = this.getTasks();
        if (tasks.length >= 2) {
            this.updateTaskStatus(tasks[0].id, 'shooting');
            this.updateTaskStatus(tasks[1].id, 'processing');
        }

        // 添加示例图片
        const sampleImages = [
            {
                name: 'product_main_001.jpg',
                category: '主图',
                relatedTask: tasks[0]?.id || '',
                uploader: 'admin'
            },
            {
                name: 'product_detail_001.jpg',
                category: '详情图',
                relatedTask: tasks[1]?.id || '',
                uploader: 'admin'
            },
            {
                name: 'product_scene_001.jpg',
                category: '场景图',
                relatedTask: '',
                uploader: 'admin'
            }
        ];

        sampleImages.forEach(image => {
            this.addImage(image);
        });

        // 添加示例审核项目
        const sampleApprovals = [
            {
                id: this.generateId(),
                title: 'SP001主图审核',
                sampleCode: 'SP001',
                description: '产品主图制作完成，请审核',
                creator: 'designer01',
                approverRole: 'operator',
                status: 'pending',
                images: [this.generateDummyImageUrl(), this.generateDummyImageUrl()],
                createTime: this.getCurrentTime(),
                relatedTaskId: tasks[0]?.id || ''
            },
            {
                id: this.generateId(),
                title: 'SP002详情图审核',
                sampleCode: 'SP002',
                description: '产品详情图制作完成，请审核',
                creator: 'designer02',
                approverRole: 'assistant',
                status: 'pending',
                images: [this.generateDummyImageUrl()],
                createTime: this.getCurrentTime(),
                relatedTaskId: tasks[1]?.id || ''
            }
        ];

        data.approvals.push(...sampleApprovals);
        this.saveData(data);
    }

    // 导出数据（用于报表功能）
    static exportData() {
        const data = this.getData();
        const exportData = {
            samples: data.samples,
            tasks: data.tasks,
            images: data.images,
            exportTime: this.getCurrentTime()
        };
        
        // 创建并下载JSON文件
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `image_order_system_export_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 清空所有数据（用于重置系统）
    static clearAllData() {
        localStorage.removeItem('imageOrderSystem');
        this.init();
    }

    // 数据备份
    static backupData() {
        const data = this.getData();
        const backup = {
            ...data,
            backupTime: this.getCurrentTime()
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_backup_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 恢复数据
    static restoreData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    // 验证数据格式
                    if (backupData.samples && backupData.tasks && backupData.images) {
                        localStorage.setItem('imageOrderSystem', JSON.stringify(backupData));
                        resolve(true);
                    } else {
                        reject(new Error('数据格式不正确'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    }
}

// 页面加载时初始化数据管理器
document.addEventListener('DOMContentLoaded', function() {
    DataManager.init();
});
