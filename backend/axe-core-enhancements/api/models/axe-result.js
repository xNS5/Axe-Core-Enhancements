/*
* This is a custom class for the Axe result object. The reason we created this is because we wanted to ensure that
* adding a new accessibility engine would be as painless as possible. Axe uses a different output format compared to the IBM ACE program, and
* as of 5/24/21 we are awaiting the release of VMWARE's CREST engine for release.
* */

class AceResult{
  url = "";
  violations;
  incomplete;

  //the issue ID, the WCAG success criteria, impact, description of the violation, code snippet, code target, summary.
  constructor(engine, results){
    if(engine === 'axe-core'){
      this.url = results.url;
      this.violations = results.violations;
      this.incomplete = results.incomplete;
    }
  }

  get url(){
    return this.url;
  }

  // parseSC(node){
  //   let re = new RegExp('^wcag([0-9]+$)|^(best practice)$');
  //   return node.matchAll(re);
  // }
}

exports.AceResult = AceResult;
