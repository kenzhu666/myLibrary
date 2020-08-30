// 让这个文件在book.css加载完毕后运行
const rootStyles = window.getComputedStyle(document.documentElement);
if (rootStyles.getPropertyValue('--book-cover-width-large') != null
    && rootStyles.getPropertyValue('--book-cover-width-large') !== '') {
    ready();
} else {
    // 检查main.css是否load
    document.getElementById('main-css').addEventListener('load', ready);
}

function ready() {
    const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'));
    const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'));
    const coverHeight = coverWidth / coverAspectRatio;
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    )

    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })

    FilePond.parse(document.body);
}

