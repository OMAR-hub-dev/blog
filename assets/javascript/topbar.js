// Nous créons les références pour notre menu et l’icône du menu :
const headerMenu = document.querySelector('.header-menu');
const burgerMenu = document.querySelector('.menu_burger');
let isMenuOpen = false;
// Cette propriété permettra de savoir si le menu mobile est créé :
let MobileMenuDom;

// Un clic sur l’icône va ouvrir ou fermer le menu
// et empêcher la propagation de l’événement à window :
burgerMenu.addEventListener('click', (event)=>{
    event.stopPropagation();
   toggleMobileMenu();
})

// Permet d’ouvrir ou de fermer le menu en fonction de son état :
const toggleMobileMenu = ()=>{
    if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
      isMenuOpen = !isMenuOpen;

} 
// Si le menu n’est pas créé nous le créons.
// Dans tous les cas nous l’ouvrons en ajoutant la classe open :
const openMenu = ()=>{
    if(!MobileMenuDom ){
        createMenuMobile();
    }
    MobileMenuDom.classList.add('open');
}
// Pour fermer le menu il suffit d’enlever la classe open sur le menu :
const closeMenu = ()=>{
    MobileMenuDom.classList.remove('open');
}

// Nous créons une div et nous ajoutons la classe mobile-menu.
// Nous empêchons la fermeture du menu sur un clic à l’intérieur.
// Nous y clonons ensuite les liens du menu normal.
const createMenuMobile = ()=>{
    MobileMenuDom = document.createElement('div');
    MobileMenuDom.classList.add('mobile-menu');
    MobileMenuDom.addEventListener('click', (event)=>{
        event.stopPropagation();
    })
    MobileMenuDom.append(headerMenu.querySelector('ul').cloneNode(true));
    headerMenu.append(MobileMenuDom);
}

// Nous récupérons les clics sur window pour fermer le menu.
window.addEventListener('click', ()=>{
    if (isMenuOpen) {
        toggleMobileMenu();
      }
    });

// Si la fenêtre est agrandie et qu’elle dépasse 480px de largeur
// Alors nous fermons le menu si il est ouvert :
window.addEventListener('resize',()=>{
    if (isMenuOpen && window.innerWidth > 480 ) {
        toggleMobileMenu();}
})