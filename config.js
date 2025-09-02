const userConfig = {
    // 页面基本信息
    pageInfo: {
        title: "请输入页面标题",
        language: "default" // 默认语言
    },

    // 样式配置
    styles: {
        backgroundImage: "components/background.jpeg",
        primaryColor: "#a6deff",
        highlightColor: "#dbA6ff", 
        infoTextColor: "#ffa6d3",
        fontFamily: "KleeOne-Regular"
    },

    // 完全自定义的内容块
    contentBlocks: [
        {
            id: "header",
            type: "header", // header, text, list, custom
            enabled: true,
            title: "请输入标题",
            content: {
                greeting: "请输入问候语",
                name: "请输入您的姓名",
                subtitle: "请输入副标题"
            },
            styles: {
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "24px"
            }
        },
        {
            id: "about",
            type: "text",
            enabled: true,
            title: "🌟 关于我",
            content: {
                text: "请输入关于您的介绍文本。您可以在这里写任何想要分享的内容。"
            },
            styles: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "24px"
            }
        },
        {
            id: "skills",
            type: "list",
            enabled: true,
            title: "💼 技能与专长",
            content: {
                items: [
                    "请输入技能1",
                    "请输入技能2", 
                    "请输入技能3"
                ]
            },
            styles: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "24px"
            }
        },
        {
            id: "hobbies",
            type: "text",
            enabled: true,
            title: "🎮 兴趣爱好",
            content: {
                text: "请输入您的兴趣爱好描述。"
            },
            styles: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "24px"
            }
        },
        {
            id: "contact",
            type: "custom",
            enabled: true,
            title: "📞 联系方式",
            content: {
                html: `
                    <p class="info-text">请输入联系方式</p>
                    <p class="info-text">邮箱：<span class="highlight">请输入邮箱</span></p>
                    <p class="info-text">电话：<span class="highlight">请输入电话</span></p>
                `
            },
            styles: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "24px",
                textAlign: "center"
            }
        }
    ]
};

// 内容块渲染器
class ContentBlockRenderer {
    constructor(container) {
        this.container = container;
    }

    renderBlock(block) {
        if (!block.enabled) return '';

        const blockElement = document.createElement('div');
        blockElement.className = 'section';
        blockElement.id = `block-${block.id}`;

        const containerElement = document.createElement('div');
        containerElement.className = 'glass-container-apple';
        
        // 应用自定义样式
        Object.assign(containerElement.style, block.styles);

        // 渲染标题
        if (block.title) {
            const titleElement = document.createElement('h3');
            titleElement.className = 'section-title';
            titleElement.textContent = block.title;
            containerElement.appendChild(titleElement);
        }

        // 根据类型渲染内容
        switch (block.type) {
            case 'header':
                this.renderHeader(containerElement, block.content);
                break;
            case 'text':
                this.renderText(containerElement, block.content);
                break;
            case 'list':
                this.renderList(containerElement, block.content);
                break;
            case 'custom':
                this.renderCustom(containerElement, block.content);
                break;
        }

        blockElement.appendChild(containerElement);
        return blockElement;
    }

    renderHeader(container, content) {
        if (content.greeting) {
            const greetingElement = document.createElement('p');
            greetingElement.className = 'info-text';
            greetingElement.textContent = content.greeting;
            container.appendChild(greetingElement);
        }

        if (content.name) {
            const nameElement = document.createElement('p');
            const nameSpan = document.createElement('strong');
            nameSpan.className = 'highlight';
            nameSpan.textContent = content.name;
            nameElement.appendChild(nameSpan);
            container.appendChild(nameElement);
        }

        if (content.subtitle) {
            const subtitleElement = document.createElement('p');
            subtitleElement.className = 'info-text';
            subtitleElement.textContent = content.subtitle;
            container.appendChild(subtitleElement);
        }
    }

    renderText(container, content) {
        const textElement = document.createElement('p');
        textElement.className = 'info-text';
        textElement.textContent = content.text;
        container.appendChild(textElement);
    }

    renderList(container, content) {
        const listElement = document.createElement('ul');
        content.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'info-text';
            listItem.textContent = item;
            listElement.appendChild(listItem);
        });
        container.appendChild(listElement);
    }

    renderCustom(container, content) {
        container.innerHTML += content.html;
    }

    renderAll() {
        // 清空容器
        this.container.innerHTML = '';

        // 添加樱花画布
        const canvas = document.createElement('canvas');
        canvas.id = 'sakura-canvas';
        canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1;';
        this.container.appendChild(canvas);

        // 渲染所有启用的内容块
        userConfig.contentBlocks.forEach(block => {
            if (block.enabled) {
                const blockElement = this.renderBlock(block);
                this.container.appendChild(blockElement);

                // 为header类型的块添加特殊样式
                if (block.type === 'header') {
                    blockElement.style.cssText = 'display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh;';
                }
            }
        });

        // 添加更新日期
        const updateElement = document.createElement('div');
        updateElement.style.cssText = 'position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%); padding: 8px 16px; background-color: rgba(255, 255, 255, 0.3); backdrop-filter: blur(10px); border-radius: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center; font-size: 14px; color: #ffcc80; font-weight: 500; z-index: 1000; border: 1px solid rgba(255, 255, 255, 0.2);';
        updateElement.innerHTML = '<span>✨ 请输入更新日期 ✨</span>';
        this.container.appendChild(updateElement);
    }
}

// 应用用户配置
function applyUserConfig() {
    // 应用页面标题
    const pageTitleElement = document.getElementById('page-title');
    if (pageTitleElement) {
        pageTitleElement.textContent = userConfig.pageInfo.title;
    }

    // 应用样式
    document.body.style.setProperty('--background-image', `url("${userConfig.styles.backgroundImage}")`);
    document.documentElement.style.setProperty('--primary-color', userConfig.styles.primaryColor);
    document.documentElement.style.setProperty('--highlight-color', userConfig.styles.highlightColor);
    document.documentElement.style.setProperty('--info-text-color', userConfig.styles.infoTextColor);

    // 渲染内容块
    const renderer = new ContentBlockRenderer(document.body);
    renderer.renderAll();
}

// 内容块管理器
class ContentBlockManager {
    static addBlock(blockConfig) {
        userConfig.contentBlocks.push(blockConfig);
        applyUserConfig();
    }

    static removeBlock(blockId) {
        userConfig.contentBlocks = userConfig.contentBlocks.filter(block => block.id !== blockId);
        applyUserConfig();
    }

    static updateBlock(blockId, newConfig) {
        const blockIndex = userConfig.contentBlocks.findIndex(block => block.id === blockId);
        if (blockIndex !== -1) {
            userConfig.contentBlocks[blockIndex] = { ...userConfig.contentBlocks[blockIndex], ...newConfig };
            applyUserConfig();
        }
    }

    static toggleBlock(blockId) {
        const block = userConfig.contentBlocks.find(block => block.id === blockId);
        if (block) {
            block.enabled = !block.enabled;
            applyUserConfig();
        }
    }

    static reorderBlocks(newOrder) {
        const reorderedBlocks = newOrder.map(id => 
            userConfig.contentBlocks.find(block => block.id === id)
        ).filter(Boolean);
        userConfig.contentBlocks = reorderedBlocks;
        applyUserConfig();
    }
}

// 暴露到全局作用域以便调试和扩展
window.userConfig = userConfig;
window.ContentBlockManager = ContentBlockManager;

// 应用配置当DOM加载完成时
document.addEventListener('DOMContentLoaded', applyUserConfig);

