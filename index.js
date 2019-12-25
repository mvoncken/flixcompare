// no frameworks, no imports.

const extractListing = (content) => {
    // regexp for the json blob.
    let ampJson = content.split('<script type="application/ld+json">')[1];
    ampJson = ampJson.split('</script>')[0];
    const amp = JSON.parse(ampJson);
    return amp.itemListElement.map((item) => item.url);
};

const diffListing = (listA, listB) => {
    // the lists are capped at max 100 or 50;
    // Find the last they have in common first and crop lists
    // that last one could be a false negative.
    const lastA = listA.map((x) => listB.includes(x)).lastIndexOf(true);
    const lastB = listB.map((x) => listA.includes(x)).lastIndexOf(true);
    const a = listA.slice(0, lastA).filter((x) => !listB.includes(x));
    const b = listB.slice(0, lastB).filter((x) => !listA.includes(x));
    const lastCommon = listA[lastA];
    return { a, b, _debug: { lastA, lastB, lastCommon } };
};

const el = (id) => document.getElementById(id);
const renderItems = (parent, items) => {
    parent.innerHTML = '';
    items.forEach((url) => {
        // whish i had templates here
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.innerText = url.match(/([^\/]*)\/*$/)[1].replace(/-/g, ' ');
        li.appendChild(a);
        parent.appendChild(li);
    });
};
const render = (state) => {
    el('countryA').innerText = state.a.country;
    el('countryB').innerText = state.b.country;
    renderItems(el('diffA'), state.a.diff);
    renderItems(el('diffB'), state.b.diff);
};

const fetchList = async (country) => {
    // todo: state display and error handling.
    const page = await (await fetch(`./mocks/100-best-tv-shows-on-netflix-${country}.html`)).text();
    console.log(page);
    return extractListing(page);
};

const init = async () => {
    const state = {
        a: { country: 'germany', list: [] },
        b: { country: 'netherlands', list: [] }
    };
    // render(state);
    state.a.list = await fetchList(state.a.country);
    state.b.list = await fetchList(state.b.country);
    const diff = diffListing(state.a.list, state.b.list);
    state.a.diff = diff.a;
    state.b.diff = diff.b;
    render(state);
};

init();
//module.exports = { extractListing, diffListing };
