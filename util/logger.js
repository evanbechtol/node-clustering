module.exports = {
  log : ( msg ) => {
    let now = new Date().toISOString();
    console.log( `${now} : ${msg}` );
  }
};
