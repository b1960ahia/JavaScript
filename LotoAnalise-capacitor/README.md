# LotoAnalise — Capacitor (Android)

## Preparar
1. Instale dependências:
```bash
npm install
```
2. Adicione Android (primeira vez):
```bash
npx cap add android
```
3. Sincronize (sempre que alterar a web):
```bash
npm run sync
```
4. Abra no Android Studio:
```bash
npm run open:android
```

Configuração usa `webDir: ../LotoAnalise`, reaproveitando seu PWA. O Service Worker e IndexedDB funcionam dentro do WebView.

Observação: a API da Caixa exige internet; offline a interface abre, mas busca de concursos não funcionará sem rede.
