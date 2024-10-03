"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xpaths_sub = exports.xpaths = void 0;
exports.xpaths = {
    Competitions: {
        rank: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[1]/div/div/div/div[1]/a/div[2]',
        medal_count: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[1]/div/div/div/div[2]/a/div',
        order: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[1]/div/div/div/div[3]/a/div/div[1]/p',
        participants: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[1]/div/div/div/div[3]/a/div/div[1]/span',
    },
    Datasets: {
        rank: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[2]/div/div/div/div[1]/a/div[2]',
        medal_count: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[2]/div/div/div/div[2]/a/div',
        order: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[2]/div/div/div/div[3]/a/div/div[1]/p',
        participants: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[2]/div/div/div/div[3]/a/div/div[1]/span',
    },
    Notebooks: {
        rank: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[3]/div/div/div/div[1]/a/div[2]',
        medal_count: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[3]/div/div/div/div[2]/a/div',
        order: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[3]/div/div/div/div[3]/a/div/div[1]/p',
        participants: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[3]/div/div/div/div[3]/a/div/div[1]/span',
    },
    Discussions: {
        rank: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[4]/div/div/div/div[1]/a/div[2]',
        medal_count: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[4]/div/div/div/div[2]/a/div',
        order: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[4]/div/div/div/div[3]/a/div/div[1]/p',
        participants: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div[1]/div[4]/div/div/div/div[3]/a/div/div[1]/span',
    },
};
exports.xpaths_sub = {
    Competitions: {
        rank: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[1]/div/div[1]/a/div[2]',
        medal_count: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[1]/div/div[2]/a/div',
        order: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[1]/div/div[3]/a/div/div[1]/p',
        participants: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[1]/div/div[3]/a/div/div[1]/span',
    },
    Datasets: {
        rank: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[2]/div/div[1]/a/div[2]',
        medal_count: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[2]/div/div[2]/a/div',
        order: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[2]/div/div[3]/a/div/div[1]/p',
        participants: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[2]/div/div[3]/a/div/div[1]/span',
    },
    Notebooks: {
        rank: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[3]/div/div[1]/a/div[2]',
        medal_count: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[3]/div/div[2]/a/div',
        order: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[3]/div/div[3]/a/div/div[1]/p',
        participants: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[3]/div/div[3]/a/div/div[1]/span',
    },
    Discussions: {
        rank: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[4]/div/div[1]/a/div[2]',
        medal_count: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[4]/div/div[2]/a/div',
        order: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[4]/div/div[3]/a/div/div[1]/p',
        participants: '//*[@id="site-content"]/div[2]/div/div[2]/div/div/div[5]/div/div[1]/div[4]/div/div[3]/a/div/div[1]/span',
    },
};
