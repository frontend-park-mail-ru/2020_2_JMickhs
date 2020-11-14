export default function registrate(): void {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js');
    }
}
