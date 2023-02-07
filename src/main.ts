import { App } from './app';

export const bootstrap = async () => {
    await new App().init();
};

(async () => {
    await bootstrap();
})();