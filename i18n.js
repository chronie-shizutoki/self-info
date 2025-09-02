const i18n = {
    currentLang: 'default',
    translations: {},

    async loadTranslations(lang) {
        try {
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations[lang] = await response.json();
            console.log(`Loaded ${lang} translations.`, this.translations[lang]);
        } catch (error) {
            console.error(`Could not load translations for ${lang}:`, error);
            // Fallback to default if loading fails
            if (lang !== 'default' && !this.translations['default']) {
                await this.loadTranslations('default');
            }
        }
    },

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        this.applyTranslations();
    },

    translate(key, defaultValue = '') {
        const keys = key.split('.');
        let result = this.translations[this.currentLang];
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                // Fallback to default if key not found in current language
                result = this.translations['default'];
                for (const ek of keys) {
                    if (result && typeof result === 'object' && ek in result) {
                        result = result[ek];
                    } else {
                        return defaultValue; // Return default if not found in default either
                    }
                }
                break;
            }
        }
        return result || defaultValue;
    },

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const defaultValue = element.getAttribute('data-i18n-default') || '';
            element.innerHTML = this.translate(key, defaultValue);
        });
        // Update page title
        const pageTitleElement = document.getElementById('page-title');
        if (pageTitleElement) {
            pageTitleElement.textContent = this.translate('page_title', 'Self-Introduction');
        }
    },

    async init() {
        const savedLang = localStorage.getItem('lang');
        const browserLang = navigator.language.split('-')[0]; // e.g., 'en-US' -> 'en'

        let initialLang = 'default'; // Default fallback

        if (savedLang && ['en', 'ja', 'zh-CN', 'zh-TW', 'default'].includes(savedLang)) {
            initialLang = savedLang;
        } else if (['ja', 'zh-CN', 'zh-TW'].includes(browserLang)) {
            initialLang = browserLang;
        } else if (browserLang.startsWith('zh')) {
            // Handle generic Chinese to specific variants
            initialLang = (browserLang === 'zh-TW' || browserLang === 'zh-HK') ? 'zh-TW' : 'zh-CN';
        } else if (browserLang === 'en') {
            initialLang = 'en';
        }

        await this.loadTranslations(initialLang);
        if (initialLang !== 'default' && !this.translations[initialLang]) {
            // If initial language failed to load, ensure default is loaded
            await this.loadTranslations('default');
            initialLang = 'default';
        }
        this.setLanguage(initialLang);

        // Add language switcher (example, can be integrated into UI)
        const langSwitcher = document.createElement('select');
        langSwitcher.id = 'language-switcher';
        langSwitcher.style.position = 'fixed';
        langSwitcher.style.top = '10px';
        langSwitcher.style.right = '10px';
        langSwitcher.style.zIndex = '10000';
        langSwitcher.style.padding = '5px';
        langSwitcher.style.borderRadius = '5px';
        langSwitcher.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        langSwitcher.style.backdropFilter = 'blur(5px)';
        langSwitcher.style.border = '1px solid rgba(255, 255, 255, 0.3)';

        const languages = {
            'default': '默认提示',
            'en': 'English',
            'ja': '日本語',
            'zh-CN': '简体中文',
            'zh-TW': '繁體中文'
        };

        for (const [code, name] of Object.entries(languages)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            langSwitcher.appendChild(option);
        }

        langSwitcher.value = this.currentLang;
        langSwitcher.addEventListener('change', async (event) => {
            const newLang = event.target.value;
            if (!this.translations[newLang]) {
                await this.loadTranslations(newLang);
            }
            this.setLanguage(newLang);
        });
        document.body.appendChild(langSwitcher);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});


