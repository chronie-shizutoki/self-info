class ContentManagement {
    constructor() {
        this.panel = document.getElementById('management-panel');
        this.toggleBtn = document.getElementById('toggle-management');
        this.closeBtn = document.getElementById('close-panel');
        this.blocksList = document.getElementById('blocks-list');
        
        this.init();
    }

    init() {
        // 绑定事件
        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.closeBtn.addEventListener('click', () => this.hidePanel());
        
        // 页面设置
        document.getElementById('page-title-input').addEventListener('input', (e) => {
            userConfig.pageInfo.title = e.target.value;
            document.getElementById('page-title').textContent = e.target.value;
        });
        
        document.getElementById('background-input').addEventListener('input', (e) => {
            userConfig.styles.backgroundImage = e.target.value;
            document.body.style.setProperty('--background-image', `url("${e.target.value}")`);
        });
        
        // 样式设置
        document.getElementById('primary-color').addEventListener('input', (e) => {
            userConfig.styles.primaryColor = e.target.value;
            document.documentElement.style.setProperty('--primary-color', e.target.value);
        });
        
        document.getElementById('highlight-color').addEventListener('input', (e) => {
            userConfig.styles.highlightColor = e.target.value;
            document.documentElement.style.setProperty('--highlight-color', e.target.value);
        });
        
        document.getElementById('text-color').addEventListener('input', (e) => {
            userConfig.styles.infoTextColor = e.target.value;
            document.documentElement.style.setProperty('--info-text-color', e.target.value);
        });
        
        // 内容块管理
        document.getElementById('add-block-btn').addEventListener('click', () => this.showAddBlockDialog());
        
        // 配置管理
        document.getElementById('save-config').addEventListener('click', () => this.saveConfig());
        document.getElementById('export-config').addEventListener('click', () => this.exportConfig());
        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-config').click();
        });
        document.getElementById('import-config').addEventListener('change', (e) => this.importConfig(e));
        
        // 初始化界面
        this.updateInterface();
        this.renderBlocksList();
    }

    togglePanel() {
        this.panel.classList.toggle('show');
    }

    hidePanel() {
        this.panel.classList.remove('show');
    }

    updateInterface() {
        // 更新界面值
        document.getElementById('page-title-input').value = userConfig.pageInfo.title;
        document.getElementById('background-input').value = userConfig.styles.backgroundImage;
        document.getElementById('primary-color').value = userConfig.styles.primaryColor;
        document.getElementById('highlight-color').value = userConfig.styles.highlightColor;
        document.getElementById('text-color').value = userConfig.styles.infoTextColor;
    }

    renderBlocksList() {
        this.blocksList.innerHTML = '';
        
        userConfig.contentBlocks.forEach((block, index) => {
            const blockItem = document.createElement('div');
            blockItem.className = 'block-item';
            blockItem.innerHTML = `
                <div class="block-header">
                    <strong>${block.title || block.id}</strong>
                    <div class="block-controls">
                        <button class="edit-btn" onclick="contentManagement.editBlock('${block.id}')">编辑</button>
                        <button class="toggle-btn ${!block.enabled ? 'disabled' : ''}" onclick="contentManagement.toggleBlock('${block.id}')">${block.enabled ? '隐藏' : '显示'}</button>
                        <button class="delete-btn" onclick="contentManagement.deleteBlock('${block.id}')">删除</button>
                    </div>
                </div>
                <div>类型: ${block.type}</div>
                <div>状态: ${block.enabled ? '启用' : '禁用'}</div>
            `;
            this.blocksList.appendChild(blockItem);
        });
    }

    showAddBlockDialog() {
        const blockTypes = {
            'header': '标题块',
            'text': '文本块',
            'list': '列表块',
            'custom': '自定义块'
        };

        const type = prompt('选择内容块类型:\n' + Object.entries(blockTypes).map(([k, v]) => `${k}: ${v}`).join('\n'), 'text');
        if (!type || !blockTypes[type]) return;

        const id = prompt('输入内容块ID (唯一标识):', `block_${Date.now()}`);
        if (!id) return;

        const title = prompt('输入内容块标题:', '新内容块');
        if (title === null) return;

        const newBlock = {
            id: id,
            type: type,
            enabled: true,
            title: title,
            content: this.getDefaultContent(type),
            styles: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "24px"
            }
        };

        ContentBlockManager.addBlock(newBlock);
        this.renderBlocksList();
    }

    getDefaultContent(type) {
        switch (type) {
            case 'header':
                return {
                    greeting: "请输入问候语",
                    name: "请输入姓名",
                    subtitle: "请输入副标题"
                };
            case 'text':
                return {
                    text: "请输入文本内容"
                };
            case 'list':
                return {
                    items: ["请输入列表项1", "请输入列表项2", "请输入列表项3"]
                };
            case 'custom':
                return {
                    html: '<p class="info-text">请输入自定义HTML内容</p>'
                };
            default:
                return {};
        }
    }

    editBlock(blockId) {
        const block = userConfig.contentBlocks.find(b => b.id === blockId);
        if (!block) return;

        const newTitle = prompt('编辑标题:', block.title);
        if (newTitle !== null) {
            block.title = newTitle;
        }

        // 根据类型编辑内容
        switch (block.type) {
            case 'header':
                const greeting = prompt('编辑问候语:', block.content.greeting);
                const name = prompt('编辑姓名:', block.content.name);
                const subtitle = prompt('编辑副标题:', block.content.subtitle);
                if (greeting !== null) block.content.greeting = greeting;
                if (name !== null) block.content.name = name;
                if (subtitle !== null) block.content.subtitle = subtitle;
                break;
            case 'text':
                const text = prompt('编辑文本内容:', block.content.text);
                if (text !== null) block.content.text = text;
                break;
            case 'list':
                const items = prompt('编辑列表项 (用换行分隔):', block.content.items.join('\n'));
                if (items !== null) {
                    block.content.items = items.split('\n').filter(item => item.trim());
                }
                break;
            case 'custom':
                const html = prompt('编辑HTML内容:', block.content.html);
                if (html !== null) block.content.html = html;
                break;
        }

        applyUserConfig();
        this.renderBlocksList();
    }

    toggleBlock(blockId) {
        ContentBlockManager.toggleBlock(blockId);
        this.renderBlocksList();
    }

    deleteBlock(blockId) {
        if (confirm('确定要删除这个内容块吗？')) {
            ContentBlockManager.removeBlock(blockId);
            this.renderBlocksList();
        }
    }

    saveConfig() {
        localStorage.setItem('userConfig', JSON.stringify(userConfig));
        alert('配置已保存到本地存储！');
    }

    exportConfig() {
        const dataStr = JSON.stringify(userConfig, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'self-intro-config.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    importConfig(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedConfig = JSON.parse(e.target.result);
                if (confirm('导入配置将覆盖当前设置，确定继续吗？')) {
                    Object.assign(userConfig, importedConfig);
                    applyUserConfig();
                    this.updateInterface();
                    this.renderBlocksList();
                    alert('配置导入成功！');
                }
            } catch (error) {
                alert('配置文件格式错误！');
            }
        };
        reader.readAsText(file);
    }

    // 从本地存储加载配置
    loadSavedConfig() {
        const saved = localStorage.getItem('userConfig');
        if (saved) {
            try {
                const savedConfig = JSON.parse(saved);
                Object.assign(userConfig, savedConfig);
                applyUserConfig();
                this.updateInterface();
                this.renderBlocksList();
            } catch (error) {
                console.error('加载保存的配置失败:', error);
            }
        }
    }
}

// 初始化内容管理系统
let contentManagement;
document.addEventListener('DOMContentLoaded', () => {
    contentManagement = new ContentManagement();
    // 加载保存的配置
    contentManagement.loadSavedConfig();
});

