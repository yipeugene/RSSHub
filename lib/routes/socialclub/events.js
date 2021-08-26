const got = require('@/utils/got');
const { CookieJar } = require('tough-cookie');
const gameList = ['GTAV', 'RDR2'];
const eventTypeName = { InGameBonus: 'In-Game Bonus', InGameUnlock: 'In-Game Unlock', InGameDiscount: 'In-Game iscount' };

module.exports = async (ctx) => {
    const gameId = gameList.includes(ctx.params.game) ? ctx.params.game : '';
    const res = await got({
        url: `https://socialclub.rockstargames.com/events/eventlisting?pageId=1&gameId=${gameId}&_=${Date.now()}`,
        headers: { 'accept-language': 'en-US,en;q=0.9' },
        cookieJar: new CookieJar(),
    });
    const { events } = res.data;

    ctx.state.data = {
        title: 'Events - Rockstar Games Social Club',
        link: 'https://socialclub.rockstargames.com/events?gameId=' + gameId,
        item:
            events &&
            events.map((x) => ({
                title: x.headerText,
                category: eventTypeName[x.eventType] || x.eventType,
                description: (x.imgUrl ? `<img src="${x.imgUrl}" /><br>` : '') + x.description,
                pubDate: new Date(x.startDate).getTime() / 1000,
                link: x.linkToUrl ? `https://socialclub.rockstargames.com/${x.linkToUrl}/${x.urlHash}` : `https://socialclub.rockstargames.com/events/${x.urlHash}/${x.slug}/1`,
            })),
    };
};
