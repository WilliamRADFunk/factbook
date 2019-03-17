# factbook
(In Progress) Serves as an independent data scraping module, complete with ontology and full scraping ability.

Also serves as child module for the larger [data-glutton](https://github.com/WilliamRADFunk/data-glutton.git), which culminates data from multiple locations and bridges them under a universal ontology.

***

## Data Already Scraped

Each time additional functionality is added to this module, the process is run through and the `dist/json/`, `dist/jsonld/`, and `dist/ontology/` folders/files are updated. If you only want the data, feel free to simply copy those files that you need.

If you want the most recent data possible, follow the instruction below to run the data scraper that will update the dist folder files for you.

***

## Using Factbook

### 1. Clone the repo

Run `git clone https://github.com/WilliamRADFunk/factbook.git` from the folder level you want factbook to be created.

### 2. Navigate to Factbook

Enter into the root level of factbook. Typically done by using the command `cd factbook`.

### 3. Install dependencies

Run the command `npm install` and wait for npm to finish installing all the packages factbook needs.

### 4. Scrape the data

Run the command `npm run scrape` and wait until it processes through the countries.

Depending on the speed and throughput of your internet connection, some countries might timeout. For now, you will be prompted whether you want to retry those countries or not. If so, type the letter `y` and press `enter`/`return`. The scraper will run through the countries that failed.

### 5. Take the data

Now the `dist/json`, `dist/jsonld`, and `dist/ontology` files are updated. Use them as you need.

### 6. You want more?

There is a project at [data-glutton](https://github.com/WilliamRADFunk/data-glutton.git) that coordinates between multiple data scrapers like this one to create a uniform, ontologically defined, store of rich linked data.

Try it out.