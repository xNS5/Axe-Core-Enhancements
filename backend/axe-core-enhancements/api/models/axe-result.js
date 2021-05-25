/*
* This is a custom class for the Axe result object. The reason we created this is because we wanted to ensure that
* adding a new accessibility engine would be as painless as possible. Axe uses a different output format compared to the IBM ACE program, and
* as of 5/24/21 we are awaiting the release of VMWARE's CREST engine for release.
* */

class AxeResult{
  #id = 0;
  #sc = [];
  #impact = "";
  #description = "";
  #code = "";
  #targets = [];
  #summary = "";

  //empty constructor
  constructor() {
  }

  // constructor passing the result object
  constructor(results) {
  }

  //the issue ID, the WCAG success criteria, impact, description of the violation, code snippet, code target, summary.
  constructor(id, wcac_sc, impact, description, code, targets, summary){
    this.#id = id;
    this.#sc = wcac_sc;
    this.#impact = impact;
    this.#description = description;
    this.#code = code;
    this.#targets = targets;
    this.#summary = summary;
  }

  get v_id(){ return this.#id;  }
  get v_impact(){ return this.#impact; }
  get v_desc(){ return this.#description; }
  get v_code(){ return this.#code;  }
  get v_summary(){ return this.#summary; }

  *get v_sc(){
    for(const criteria of this.#sc){
      yield criteria;
    }
  }

  *get v_target(){
    for(const target of this.#targets){
      yield target;
    }
  }

}
