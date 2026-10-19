//Наблюдатель
class ScrollWatcher {
    constructor(props) {
        let defaultConfig = {
            logging: true,
        }
        this.config = Object.assign(defaultConfig, props);
        this.observer;
        !document.documentElement.classList.contains('watcher') ? this.scrollWatcherRun() : null;
    }
    scrollWatcherUpdate() {
        this.scrollWatcherRun();
    }
    scrollWatcherRun() {
        document.documentElement.classList.add('watcher');
        this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]'));
    }
    scrollWatcherConstructor(items) {
        if (items.length) {
            let uniqParams = uniqArray(Array.from(items).map(function (item) {
                if (item.dataset.watch === 'navigator' && !item.dataset.watchThreshold) {
                    let valueOfThreshold;
                    if (item.clientHeight > 2) {
                        valueOfThreshold =
                            window.innerHeight / 2 / (item.clientHeight - 1);
                        if (valueOfThreshold > 1) {
                            valueOfThreshold = 1;
                        }
                    } else {
                        valueOfThreshold = 1;
                    }
                    item.setAttribute(
                        'data-watch-threshold',
                        valueOfThreshold.toFixed(2)
                    );
                }
                return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
            }));
            uniqParams.forEach(uniqParam => {
                let uniqParamArray = uniqParam.split('|');
                let paramsWatch = {
                    root: uniqParamArray[0],
                    margin: uniqParamArray[1],
                    threshold: uniqParamArray[2]
                }
                let groupItems = Array.from(items).filter(function (item) {
                    let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                    let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px';
                    let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                    if (
                        String(watchRoot) === paramsWatch.root &&
                        String(watchMargin) === paramsWatch.margin &&
                        String(watchThreshold) === paramsWatch.threshold
                    ) {
                        return item;
                    }
                });

                let configWatcher = this.getScrollWatcherConfig(paramsWatch);

                this.scrollWatcherInit(groupItems, configWatcher);
            });
        }
    }
    getScrollWatcherConfig(paramsWatch) {
        let configWatcher = {}
        if (document.querySelector(paramsWatch.root)) {
            configWatcher.root = document.querySelector(paramsWatch.root);
        }
        configWatcher.rootMargin = paramsWatch.margin;
        if (paramsWatch.margin.indexOf('px') < 0 && paramsWatch.margin.indexOf('%') < 0) {
            return
        }
        if (paramsWatch.threshold === 'prx') {
            paramsWatch.threshold = [];
            for (let i = 0; i <= 1.0; i += 0.005) {
                paramsWatch.threshold.push(i);
            }
        } else {
            paramsWatch.threshold = paramsWatch.threshold.split(',');
        }
        configWatcher.threshold = paramsWatch.threshold;

        return configWatcher;
    }
    scrollWatcherCreate(configWatcher) {
        console.log(configWatcher);
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                this.scrollWatcherCallback(entry, observer);
            });
        }, configWatcher);
    }
    scrollWatcherInit(items, configWatcher) {
        this.scrollWatcherCreate(configWatcher);
        items.forEach(item => this.observer.observe(item));
    }
    applyWatchDelay(targetElement, isIntersecting) {
        if (!targetElement.hasAttribute('data-watch-delay')) return;
        const delay = parseInt(targetElement.dataset.watchDelay, 10) || 0;
        if (isIntersecting) {
            targetElement.style.setProperty('--watch-delay', `${delay}ms`);
        }
    }
    scrollWatcherIntersecting(entry, targetElement) {
        if (entry.isIntersecting) {
            this.applyWatchDelay(targetElement, true);
            !targetElement.classList.contains('_watcher-view') ? targetElement.classList.add('_watcher-view') : null;
        } else {
            targetElement.classList.contains('_watcher-view') ? targetElement.classList.remove('_watcher-view') : null;
            if (targetElement.hasAttribute('data-watch-delay')) {
                targetElement.style.removeProperty('--watch-delay');
            }
        }
    }
    scrollWatcherOff(targetElement, observer) {
        observer.unobserve(targetElement);
    }
    scrollWatcherCallback(entry, observer) {
        const targetElement = entry.target;
        this.scrollWatcherIntersecting(entry, targetElement);
        targetElement.hasAttribute('data-watch-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
        document.dispatchEvent(new CustomEvent("watcherCallback", {
            detail: {
                entry: entry
            }
        }));
    }
}
modules_flsModules.watcher = new ScrollWatcher({});

