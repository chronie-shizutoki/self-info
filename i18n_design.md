# 国际化 (i18n) 架构设计

## 1. 语言检测与切换
- **自动检测**: 优先使用浏览器语言设置 (`navigator.language`)。
- **手动切换**: 在页面上提供语言选择器，允许用户手动切换语言。切换后，将用户选择的语言偏好存储在 `localStorage` 中，以便下次访问时记住。
- **URL 参数**: 支持通过 URL 参数（例如 `?lang=en`）指定语言，优先级高于 `localStorage` 和浏览器设置。

## 2. 内容存储
- **JSON 文件**: 为每种支持的语言创建一个独立的 JSON 文件，例如 `locales/zh-CN.json`, `locales/zh-TW.json`, `locales/ja.json`, `locales/en.json`。
- **结构**: JSON 文件将包含键值对，其中键是用于引用文本的唯一标识符，值是对应语言的翻译文本。例如：
  ```json
  // locales/en.json
  {
    "common": {
      "accept": "Accept",
      "reject": "Reject"
    },
    "privacy": {
      "title": "Privacy Policy Consent",
      "text1": "This site uses Google Analytics 4 (GA4).",
      "text2": "By accessing, you agree to share your data (IP address, cookies, location, etc.) with Google and send it overseas.",
      "text3": "We anonymize your data for privacy protection!",
      "link1": "Learn more? (English)",
      "link2": "Privacy Consent Form",
      "warning": "By continuing to access, you agree that your data will be sent to the US! US laws may apply!"
    },
    "header": {
      "greeting": "Hi, nice to meet you!",
      "name_prefix": "Call me ",
      "name": "Nekotan Shizutoki",
      "name_suffix": "",
      "alt_name_prefix": "You can also call me ",
      "alt_name": "Chronie",
      "alt_name_suffix": "!"
    }
  }
  ```

## 3. 内容渲染
- **JavaScript 动态加载**: 在页面加载时，根据检测到的或用户选择的语言，动态加载相应的 JSON 文件。
- **模板字符串/占位符**: 使用 JavaScript 替换 HTML 中的特定占位符或通过数据绑定将翻译后的文本插入到 DOM 中。

## 4. 字体处理
- **多语言字体**: 确保所选字体支持所有目标语言的字符集。如果需要，可以为不同语言加载不同的字体。

# 用户定制功能设计

## 1. 内容定制
- **配置文件**: 创建一个独立的 JavaScript 或 JSON 配置文件（例如 `config.js` 或 `user_data.json`），用于存储用户的个人信息、介绍文本、社交链接等。此文件将包含所有可定制内容的默认值和占位符。
- **模块化**: 将网站的各个部分（如个人信息、技能、兴趣等）设计为可配置的模块，用户可以启用/禁用或重新排序。
- **默认提示**: 对于未定制的内容，将显示默认的提示信息，例如“请输入您的个人简介”。

## 2. 样式定制
- **CSS 变量**: 使用 CSS 变量（Custom Properties）来定义颜色、字体大小、间距等，方便通过 JavaScript 动态修改。
- **主题切换**: 提供预设的主题选项（例如，浅色/深色模式），或允许用户选择主色调。
- **背景图片**: 允许用户上传自定义背景图片。图片路径存储在配置文件中，并通过 CSS 动态加载。

## 3. 背景图片定制
- **图片上传**: 考虑提供一个简单的机制让用户上传图片（如果网站是部署在服务器上）。对于静态网站，用户可能需要手动替换图片文件。
- **配置路径**: 在配置文件中提供一个字段，用于指定背景图片的 URL 或相对路径。

## 4. 实现方式
- **JavaScript**: 大部分定制功能将通过 JavaScript 实现，读取配置文件并动态修改 DOM 元素和 CSS 样式。
- **HTML 结构**: 确保 HTML 结构足够灵活，以便通过 JavaScript 轻松操作和更新内容。

# 实施步骤概览
1.  **重构 HTML**: 将硬编码的文本替换为国际化键。
2.  **创建 `locales` 文件夹**: 包含 `zh-CN.json`, `zh-TW.json`, `ja.json`, `en.json` 等语言文件。
3.  **编写国际化 JavaScript 模块**: 负责加载语言文件、切换语言和渲染文本。
4.  **创建 `config.js`**: 用于用户内容和样式定制，包含默认提示。
5.  **修改 CSS**: 使用 CSS 变量和动态背景图片加载。
6.  **更新现有 JavaScript**: 调整 `birthday.js` 和 `splash-screen.js` 以适应新的国际化和定制架构。
7.  **测试**: 确保所有功能在不同语言和定制选项下正常工作。

