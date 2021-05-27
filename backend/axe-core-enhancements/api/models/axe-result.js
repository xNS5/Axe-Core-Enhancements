/*
* This is a custom class for the Axe result object. The reason we created this is because we wanted to ensure that
* adding a new accessibility engine would be as painless as possible. Axe uses a different output format compared to the IBM Equal Access program, and
* as of 5/24/21 we are awaiting the release of VMWARE's CREST engine for release.
* */

class AceResult{
  url = "";
  violations;
  incomplete;
  violation_nodes;
  incomplete_nodes;

  //the issue ID, the WCAG success criteria, impact, description of the violation, code snippet, code target, summary.
  constructor(engine, results){
    if(engine === 'axe-core'){
      this.url = results.url;
      this.violations = this.parseTags(results.violations);
      this.incomplete = this.parseTags(results.incomplete);
      this.violations.map(e => console.log(e.tags));

    }
  }

  get url(){
    return this.url;
  }

  get violations(){
    return this.violations;
  }

  get incomplete(){
    return this.incomplete;
  }

  get violation_nodes(){
    return this.violation_nodes;
  }

  get incomplete_nodes(){
    return this.incomplete_nodes;
  }

  parseTags(violation){
    let wcag_regex = new RegExp('^(wcag)([0-9]+)$');
    let section508_regex = new RegExp('^(section508)');
    let wcag_level_regex = new RegExp('^(wcag)(21|2)');
    let temp_wcag_level = new RegExp('^(wcag21)');
    let ace_regex = new RegExp('^(ACT)$');
    let best_practices_regex = new RegExp('^(best-practice)$')

   if(violation.length > 0){
     for(let i = 0; i < violation.length; i++){
       for(let j = 0; j < violation[i].tags.length; j++){
         violation[i].tags = violation[i].tags.filter(e => !e.match(new RegExp('^(cat.*)')));
         let tag = violation[i].tags[j];
         let new_tag;
         if(wcag_regex.test(tag)){
           new_tag = `WCAG ${tag.slice(4).split('').join('.')}`
         } else if(section508_regex.test(tag)){
           // Already matches "section508", so checks to see if there's a rule number after
           new_tag = `Section508 ${((tag.length === 10) ? '': tag.slice(10).replaceAll('.', ''))}`;
         } else if(wcag_level_regex.test(tag)){
           let lvl21 = false;
           if(temp_wcag_level.test(tag)){
             new_tag = 'WCAG2.1 ';
             lvl21 = true;      // Checks to see if the WCAG is 2.0 or 2.1
           } else {
             new_tag = 'WCAG2.0 ';
           }
           //The boolean determines where the string gets sliced
           new_tag += ((tag.slice((lvl21) ? 6 : 5).length) === 1 ? "A" : "AA");
         }else if(ace_regex.test(tag)){
           new_tag = `Accessibility Conformance Testing`;
         } else if(best_practices_regex.test(tag)){
           new_tag = `Deque Best Practices`;
         }
         if(new_tag){
           violation[i].tags[j] = new_tag;
         }
       }
      /*       violation[i].tags = violation[i].tags.filter(tag => !tag.match(new RegExp('^(cat.)'))).map(tag =>{
         let wcag_regex = new RegExp('^(wcag)([0-9]+)$');
         let section508_regex = new RegExp('^(section508)');
         let wcag_level_regex = new RegExp('^(wcag)(21|2)');
         let temp_wcag_level = new RegExp('^(wcag21)');
         let ace_regex = new RegExp('^(ACE)$');
         let best_practices_regex = new RegExp('^(best-practice)$')

         if(wcag_regex.test(tag)){
           return `WCAG ${tag.slice(4).split('').join('.')}`;
         } else if(section508_regex.test(tag)){
           // Already matches "section508", so checks to see if there's a rule number after
           return `Section 508 ${((tag.length === 10) ? '': tag.slice(10).replaceAll('.', ''))}`;
         } else if(wcag_level_regex.test(tag)) {
           // console.log(tag);
           let lvl21 = false;
           let new_tag;
           if (temp_wcag_level.test(tag)) {
             new_tag = 'WCAG2.1';
             lvl21 = true;      // Checks to see if the WCAG is 2.0 or 2.1
           } else {
             new_tag = 'WCAG2.0';
           }
           //The boolean determines where the string gets sliced
           return `${new_tag} ${new Array(tag.slice((lvl21) ? 6 : 5).length+1).join('A')}`;
         } else if(ace_regex.test(tag)){
           return `Accessibility Conformance Testing`;
         } else if(best_practices_regex.test(tag)){
           return `Deque Best Practices`;
         }
         return tag;
       });*/
     }
   }
   return violation;
  }
}

exports.AceResult = AceResult;
