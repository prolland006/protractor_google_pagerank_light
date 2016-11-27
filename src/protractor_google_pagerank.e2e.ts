/**
 * Params
 * @type {string}
 */
import { browser, by, element } from 'protractor';

const KEYWORDS = 'github ionic';
const LINK_TO_FIND = 'prolland006'; // even just a part
const MAX_GOOGLE_PAGE_TO_CHECK = 40;
const SLEEP_BEFORE_NEW_PAGE = 1500;
const SLEEP_AFTER_NEW_PAGE = 1500;
const USE_HREF = 1;
const USE_INNERTEXT = 2;

let use_condition = USE_HREF; // = USE_INNERTEXT or USE_HREF

/**
 * find something on google page per page
 * @param linkToFind
 * @param page
 * @returns {Promise<number>}
 */
function findInPage(linkToFind:string, page: number) :any {

  let conditionPromise: any;
  if (use_condition == USE_INNERTEXT) {
    conditionPromise = browser.findElement(by.partialLinkText(linkToFind));
  } else {
    conditionPromise = browser.findElement(by.css(`a[href*="${linkToFind}"]`));
  }

  return conditionPromise
    .then(element => {

      // #### PAGE FOUND
      element.getText().then(text=>{
        console.log('INNERTEXT : ', text);
      });

      element.getAttribute('href').then(attribute=>{
        console.log('HREF : ', attribute);
      });

      console.log('PAGE : ', page);
      return page;

    },(err)=>{
      // not found
      if (page == MAX_GOOGLE_PAGE_TO_CHECK) {
        return Promise.reject(-1);
      }
      browser.sleep(SLEEP_BEFORE_NEW_PAGE);
      element(by.css(`a[aria-label="Page ${++page}"`)).click(); //stuff to set the page
      browser.sleep(SLEEP_AFTER_NEW_PAGE);
      return findInPage(linkToFind, page);
    });
}

describe('pagerank on google tks to protractor', () => {

  fit('search link on google', (done) => {

    console.log(`keywords=${browser.params.keywords}`);

    browser.get('https://www.google.fr/');
    browser.waitForAngular();

    element(by.css('.gsfi')).sendKeys(KEYWORDS);
    element(by.css('.sbico')).click();
    browser.sleep(2000);

    findInPage(LINK_TO_FIND, 1)
      .then(
        (page)=>{
          console.log('#### PAGE FOUND : ',page)
          done();
        },
        (err)=>{
          console.log('#### NOT FOUND');
          done();
        }
      );
  });


});

