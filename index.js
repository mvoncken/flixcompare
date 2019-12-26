// no frameworks, no imports.
// no error handling, staying below 100 lines is the challenge.
const apiPrefix = 'https://wldf5e9vl5.execute-api.eu-west-1.amazonaws.com/dev/list?list=';

// == Logic section ==
const extractListing = (content) => {
    // extracts listing from html page
    let ampJson = content.split('<script type="application/ld+json">')[1];
    ampJson = ampJson.split('</script>')[0];
    const amp = JSON.parse(ampJson);
    return amp.itemListElement.map((item) => item.url);
};

const fetchList = async (country) => {
    // todo: state display and error handling.
    // this is a <100 line project, adding logic to a proxy(extractListing) would break my goal.
    const url = `${apiPrefix}100-best-tv-shows-on-netflix-${country}/`.replace('-usa/', '');
    const page = await (await fetch(url)).text();
    return extractListing(page);
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

// == UI section ==
const el = (id) => document.getElementById(id);
const renderItems = (parent, items) => {
    parent.innerHTML = '';
    items.forEach((url) => {
        // whish i had templates here
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.innerText = url.match(/([^\/]*)\/*$/)[1].replace(/-/g, ' ');
        li.appendChild(a);
        parent.appendChild(li);
    });
};

const sync = (state) => {
    state.a.diff = [];
    state.b.diff = [];
    if (state.a.list.length && state.b.list.length) {
        const diff = diffListing(state.a.list, state.b.list);
        state.a.diff = diff.a;
        state.b.diff = diff.b;
    }
    render(state);
};
const render = (state) => {
    console.log('render: state=', state);
    el('countryA').innerText = state.a.country;
    el('countryB').innerText = state.b.country;
    el('statusA').innerText = state.a.status;
    el('statusB').innerText = state.b.status;
    renderItems(el('diffA'), state.a.diff);
    renderItems(el('diffB'), state.b.diff);
};

const handleCountryChange = async (ab, value, state) => {
    const cState = state[ab];
    cState.country = value;
    cState.status = 'Pending....';
    cState.list = [];
    sync(state);
    cState.list = await fetchList(cState.country);
    cState.status = '';
    sync(state);
};

const init = async () => {
    const state = {
        a: { country: 'germany', list: [], diff: [], status: 'init?!' },
        b: { country: 'netherlands', list: [], diff: [], status: 'init?!' }
    };
    handleCountryChange('a', 'germany', state);
    handleCountryChange('b', 'netherlands', state);
    el('selectA').addEventListener('change', (e) =>
        handleCountryChange('a', e.target.value, state)
    );
    el('selectB').addEventListener('change', (e) =>
        handleCountryChange('b', e.target.value, state)
    );
};

init();
