/**
* This is a custom class for the Axe result object. The reason we created this is because we wanted to ensure that
* adding a new accessibility engine would be as painless as possible. Axe uses a different output format compared to the IBM Equal Access program, and
* as of 5/24/21 we are awaiting the release of VMWARE's CREST engine for release.
*
* @param engine: string representing the accessibility engine the user wants to test.
* @param results: an array containing the results of an accessibility scan.
*
* aXe
* @field url: url of the tested website.
* @field dimensions: dimensions of the browser window sizes
* @field violations: An array of WCAG violations
* @field incomplete: An array of incomplete Axe tests that require a human to review
* */


class AceResult{

  constructor(engine, results) {
    if (engine === 'axe-core') {
      this.title = results.pageTitle;
      this._url = results.url;
      this._dimensions = {height: results.testEnvironment['windowHeight'], width: results.testEnvironment['windowWidth']};
      this._violations = this.parseTags(results.violations);
      this._incomplete = this.parseTags(results.incomplete);
    }
  }

  getURL(){
    return this._url;
  }

  getTitle(){
    return this.title;
  }

  getViolations(){
    return this._violations;
  }

  getIncomplete(){
    return this._incomplete;
  }

  getDimensions(){
    return this._dimensions;
  }

  getScreenWidth(){
    return this._dimensions.width;
  }

  getScreenHeight(){
    return this._dimensions.height;
  }

  parseTags(violations) {
    /*
    * Regular expressions for each WCAG tag.
    * section508_regex = new RegExp('^(section508)')
    * wcag_level_regex = new RegExp('^(wcag)(21|2)(a){0,3}$')
    * ace_regex = new RegExp('^(ACT)$')
    * best_practices_regex = new RegExp('^(best-practice)$')
    * */
    let wcag_regex = new RegExp('^(wcag)([0-9]{3,4})$');

    if (violations.length > 0) {
      for (let i = 0; i < violations.length; i++) {
        let tags = violations[i].tags;
        for (let j = 0; j < tags.length; j++) {
          let tag = tags[j];
          let new_tag;

          if (wcag_regex.test(tag)) { // Tests to see if the tag contains a WCAG SC
              if(tag.length === 8){
                let temp_tag = tag.slice(4,7);
                let temp_tag2 = tag.slice(7);
                new_tag = temp_tag.split('').join('.') + temp_tag2;
              }else{
               new_tag = tag.slice(4).split('').join('.');
              }
              violations[i].tags.splice(j, 1, (new_tag ? [new_tag] : [tag]));
          }else{
            violations[i].tags.splice(j,1);
            j-=1;
          }

          /*
          * Uncomment the rest of this block to parse the rest of the accessibility tags
          * */

         /* if((new RegExp('^(cat.*)').test(tag))){
            // Removes the Deque category tags, decrements j in order to not skip over tags
            tags.splice(j, 1);
            j-=1;
          } else {
            if (wcag_regex.test(tag)) { // Tests to see if the tag contains a WCAG SC
              //  Original code used to splice WCAg info + hyperlink
                // id = "=hyperlink(\"\"" + violations[j].helpUrl + "\"\"\, \"\"" + violations[j].id + "\"\")";
                // new_tag = `WCAG ${tag.slice(4).split('').join('.')}`;
                if(tag.length == 8){
                  let temp_tag = tag.slice(4,7);
                  let temp_tag2 = tag.slice(7);
                  new_tag = temp_tag.split('').join('.') + temp_tag2;
                }else{
                 new_tag = tag.slice(4).split('').join('.');
                }
              let info = tag.slice(4).split('');
              new_tag = '=hyperlink(""' + getLinkToCriterion('2.1', info[0], info[1], info[2]) + '"", ""WCAG ' + info.join('.') + '"")';
              new_tag = "";
          } else if (wcag_level_regex.test(tag)) { // Tests to see if the tag is that of a level (e.g. wcag2a denoting WCAG 2A level violations)
              if (tag.includes('1')){
                new_tag = 'WCAG2.1 ';
              } else {
                new_tag = 'WCAG2.0 ';
              }
              // Creates a dynamic number of "A"s depending on the input count
              let level = 'A'.repeat(tag.length - (tag.indexOf((tag.includes('1') ? '1' : '2'))+1));
              new_tag += level;

            } else if (tag.includes('section508')) {
              // Already matches "section508", so checks to see if there's a rule number after
              new_tag = `Section508 ${((tag.length === 10) ? '' : tag.slice(11).replace('/./g', ''))}`;
            } else if (wcag_level_regex.test(tag)) {
              if ((new RegExp('^(wcag21)').test(tag))){
                new_tag = 'WCAG2.1 ';
              } else {
                new_tag = 'WCAG2.0 ';
              }
              //The boolean determines where the string gets sliced
              new_tag += ((tag.slice((new_tag === 'WCAG2.1 ') ? 6 : 5).length) === 1 ? 'A' : 'AA');
            } else if (ace_regex.test(tag)) {
              new_tag = `Accessibility Conformance Testing`;
            } else if (best_practices_regex.test(tag)) {
              new_tag = `Deque Best Practices`;
            }
            violations[i].tags.splice(j, 1, (new_tag ? [new_tag] : [tag]));
          }*/
        }
      }
    }
    return violations;
  }
}

module.exports.AceResult = AceResult;
