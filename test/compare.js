const fs = require('fs');
const assert = require('assert');

const pageDE = fs.readFileSync('./mocks/100-best-tv-shows-on-netflix-germany.html', 'utf-8');
const pageNL = fs.readFileSync('./mocks/100-best-tv-shows-on-netflix-netherlands.html', 'utf-8');

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

const testExtract = () => {
    const listing = extractListing(pageDE);
    console.log(listing);
    console.log(listing.length);
    assert(listing.length === 100);
};

const testDiff = () => {
    const diff = diffListing(extractListing(pageDE), extractListing(pageNL));
    console.log(diff);
    // NL has more than DE.
};

//testExtract();
testDiff();
