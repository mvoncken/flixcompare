Goal : Compare 2 countries in netflix
Please steal this idea.

Visiting my parents in NL, what should I watch here?

# MVP

-   KISS and YANGI to the extreme
    -   tech demo/ not production.
-   publish on github pages
-   display diff between country a/b on best tv show(100) : (`https://www.flixwatch.co/lists/100-best-tv-shows-on-netflix-germany/)`
-   select for country a/b
-   select for section
-   node install, npm build npm publish

# Planning/execution

# b0 : proof of concept

-   setup project, git, github, README
-   mocks for 4 countries
-   parse method for a country page
-   diff method for the 2 mocks

# b1 : Ui demo

-   add index.html
-   fetch 2 countries from mocks
-   display diff
-   push to github pages (Fail->has to be username.github.io; try netlify?)

# b2 : handle CORS/api

-   cors proxy or lambda
-   fetch from live data
-   https://wldf5e9vl5.execute-api.eu-west-1.amazonaws.com/dev/list?list=100-best-tv-shows-on-netflix-germany

## b3 : functional Ui

-   select A+B for 2+ countries
-   select category
-   handle updates

## b4 :

-   complete data lists
-   Static hosting; netlify?

# TODO

-   styling
-   remove or fix tests
