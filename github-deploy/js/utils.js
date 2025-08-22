// 工具函数库
class Utils {
    // 日期格式化
    static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second);
    }

    // 获取相对时间
    static getRelativeTime(date) {
        const now = new Date();
        const target = new Date(date);
        const diff = now - target;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}天前`;
        } else if (hours > 0) {
            return `${hours}小时前`;
        } else if (minutes > 0) {
            return `${minutes}分钟前`;
        } else {
            return '刚刚';
        }
    }

    // 文件大小格式化
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 防抖函数
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 深拷贝
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
    }

    // 验证邮箱
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 验证手机号
    static validatePhone(phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    }

    // 生成随机颜色
    static randomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    // 生成UUID
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 数组去重
    static uniqueArray(arr, key = null) {
        if (key) {
            const seen = new Set();
            return arr.filter(item => {
                const value = item[key];
                if (seen.has(value)) {
                    return false;
                } else {
                    seen.add(value);
                    return true;
                }
            });
        } else {
            return [...new Set(arr)];
        }
    }

    // 字符串截断
    static truncateText(text, length, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
    }

    // 下载文件
    static downloadFile(data, filename, type = 'text/plain') {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 复制到剪贴板
    static copyToClipboard(text) {
        return navigator.clipboard.writeText(text).then(() => {
            return true;
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        });
    }

    // 全屏显示
    static requestFullscreen(element = document.documentElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // 退出全屏
    static exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // 检测是否为移动设备
    static isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 获取URL参数
    static getUrlParams() {
        const params = {};
        const urlSearchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlSearchParams) {
            params[key] = value;
        }
        return params;
    }

    // 设置URL参数
    static setUrlParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    }

    // 本地存储操作
    static storage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('localStorage设置失败:', e);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('localStorage获取失败:', e);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('localStorage删除失败:', e);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('localStorage清空失败:', e);
                return false;
            }
        }
    };

    // Cookie操作
    static cookie = {
        set(name, value, days = 7) {
            const expires = new Date(Date.now() + days * 864e5).toUTCString();
            document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
        },

        get(name) {
            return document.cookie.split('; ').reduce((r, v) => {
                const parts = v.split('=');
                return parts[0] === name ? decodeURIComponent(parts[1]) : r;
            }, '');
        },

        delete(name) {
            this.set(name, '', -1);
        }
    };

    // 图片相关工具
    static image = {
        // 压缩图片
        compress(file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = () => {
                    // 计算新尺寸
                    let { width, height } = img;
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // 绘制图片
                    ctx.drawImage(img, 0, 0, width, height);

                    // 转换为Blob
                    canvas.toBlob(resolve, 'image/jpeg', quality);
                };

                img.src = URL.createObjectURL(file);
            });
        },

        // 图片转Base64
        toBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        },

        // 获取图片尺寸
        getDimensions(file) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });
                };
                img.src = URL.createObjectURL(file);
            });
        }
    };

    // 数据验证
    static validator = {
        required(value) {
            return value !== null && value !== undefined && value !== '';
        },

        minLength(value, min) {
            return value && value.length >= min;
        },

        maxLength(value, max) {
            return value && value.length <= max;
        },

        pattern(value, regex) {
            return regex.test(value);
        },

        number(value) {
            return !isNaN(value) && isFinite(value);
        },

        integer(value) {
            return Number.isInteger(Number(value));
        },

        positive(value) {
            return Number(value) > 0;
        },

        url(value) {
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        }
    };

    // API请求工具
    static api = {
        async request(url, options = {}) {
            const defaultOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const config = Object.assign({}, defaultOptions, options);

            try {
                const response = await fetch(url, config);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                } else {
                    return await response.text();
                }
            } catch (error) {
                console.error('API请求失败:', error);
                throw error;
            }
        },

        async get(url, params = {}) {
            const urlWithParams = new URL(url);
            Object.keys(params).forEach(key => {
                urlWithParams.searchParams.append(key, params[key]);
            });
            return this.request(urlWithParams.toString());
        },

        async post(url, data = {}) {
            return this.request(url, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        async put(url, data = {}) {
            return this.request(url, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        async delete(url) {
            return this.request(url, {
                method: 'DELETE'
            });
        }
    };

    // 性能监控
    static performance = {
        mark(name) {
            if (performance.mark) {
                performance.mark(name);
            }
        },

        measure(name, startMark, endMark) {
            if (performance.measure) {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                return measure ? measure.duration : 0;
            }
            return 0;
        },

        now() {
            return performance.now ? performance.now() : Date.now();
        }
    };

    // 错误处理
    static errorHandler = {
        global() {
            window.addEventListener('error', (event) => {
                console.error('全局错误:', {
                    message: event.message,
                    filename: event.filename,
                    line: event.lineno,
                    column: event.colno,
                    error: event.error
                });
            });

            window.addEventListener('unhandledrejection', (event) => {
                console.error('未处理的Promise拒绝:', event.reason);
            });
        },

        try(fn, fallback = null) {
            try {
                return fn();
            } catch (error) {
                console.error('函数执行错误:', error);
                return fallback;
            }
        },

        async tryAsync(fn, fallback = null) {
            try {
                return await fn();
            } catch (error) {
                console.error('异步函数执行错误:', error);
                return fallback;
            }
        }
    };

    // 动画工具
    static animation = {
        fadeIn(element, duration = 300) {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            const start = performance.now();
            
            function animate(timestamp) {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        },

        fadeOut(element, duration = 300) {
            const start = performance.now();
            const startOpacity = parseFloat(element.style.opacity) || 1;
            
            function animate(timestamp) {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = startOpacity * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            }
            
            requestAnimationFrame(animate);
        },

        slideDown(element, duration = 300) {
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.display = 'block';
            
            const targetHeight = element.scrollHeight;
            const start = performance.now();
            
            function animate(timestamp) {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = (targetHeight * progress) + 'px';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.height = '';
                    element.style.overflow = '';
                }
            }
            
            requestAnimationFrame(animate);
        }
    };
}

// 全局错误处理
Utils.errorHandler.global();

// 导出到全局
window.Utils = Utils;
