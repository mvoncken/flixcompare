/* eslint-disable no-undef */
// No frameworks, no imports, no error handling, staying below 100 lines is the challenge.
// You want to expand functionality? PLEASE STOP NOW, rewrite and use a proper framework.
const apiPrefix = 'https://wldf5e9vl5.execute-api.eu-west-1.amazonaws.com/dev/list?list=';
// == Logic section ==
const extractListing = (content) => {
    // extracts listing from html page
    let ampJson = content.split('<script type="application/ld+json">')[1];
    ampJson = JSON.parse(ampJson.split('</script>')[0]);
    return ampJson.itemListElement.map((item) => item.url);
};
const fetchList = async (category, country) => {
    // todo: state display and error handling.
    // this is a <100 line project, adding logic to a proxy(extractListing) would break my goal.
    const url = `${apiPrefix}${category}-${country}/`.replace('-usa/', '');
    const page = await (await fetch(url)).text();
    return extractListing(page);
};
const diffListing = (listA, listB) => {
    // The lists are capped at max 100 or 50;
    // Find the last they have in common first and crop lists. That last one could be a false negative.
    const lastA = listA.map((x) => listB.includes(x)).lastIndexOf(true);
    const lastB = listB.map((x) => listA.includes(x)).lastIndexOf(true);
    const a = listA.slice(0, lastA).filter((x) => !listB.includes(x));
    const b = listB.slice(0, lastB).filter((x) => !listA.includes(x));
    return { a, b, _debug: { lastA, lastB } };
};
// == UI section ==
const state = {
    category: '100-best-tv-shows-on-netflix',
    a: { country: 'Germany', list: [], diff: [], status: 'init?!' },
    b: { country: 'Netherlands', list: [], diff: [], status: 'init?!' }
};
const el = (id) => document.getElementById(id); // helper
const renderItems = (parent, items) => {
    parent.innerHTML = '';
    items.forEach((url) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.innerText = url.match(/([^\/]*)\/*$/)[1].replace(/-/g, ' ');
        li.appendChild(a) && parent.appendChild(li);
    });
};
const renderSelect = (parent, items, initValue) => {
    items.forEach((item) => {
        const opt = document.createElement('option');
        opt.innerText = item;
        parent.appendChild(opt);
    });
    parent.value = initValue;
};
const sync = () => {
    state.a.diff = [];
    state.b.diff = [];
    if (state.a.list.length && state.b.list.length) {
        const diff = diffListing(state.a.list, state.b.list);
        state.a.diff = diff.a;
        state.b.diff = diff.b;
    }
    render(state);
};
const render = () => {
    console.log('render: state=', state);
    el('categoryTitle').innerText = state.category;
    el('countryA').innerText = state.a.country;
    el('countryB').innerText = state.b.country;
    el('statusA').innerText = state.a.status;
    el('statusB').innerText = state.b.status;
    renderItems(el('diffA'), state.a.diff);
    renderItems(el('diffB'), state.b.diff);
};
const handleCountryChange = async (ab, value) => {
    const cState = state[ab];
    cState.country = value;
    cState.status = 'Pending....';
    cState.list = [];
    sync(state);
    cState.list = await fetchList(state.category, cState.country.toLowerCase());
    cState.status = '';
    sync(state);
};
const handleCategoryChange = async (value) => {
    state.category = value;
    handleCountryChange('a', state.a.country);
    handleCountryChange('b', state.b.country);
};
const init = async () => {
    renderSelect(el('selectA'), COUNTRIES, state.a.country);
    renderSelect(el('selectB'), COUNTRIES, state.b.country);
    renderSelect(el('category'), CATEGORIES, state.category);
    handleCountryChange('a', state.a.country);
    handleCountryChange('b', state.b.country);
    el('selectA').addEventListener('change', (e) => handleCountryChange('a', e.target.value));
    el('selectB').addEventListener('change', (e) => handleCountryChange('b', e.target.value));
    el('category').addEventListener('change', (e) => handleCategoryChange(e.target.value));
};
init();
