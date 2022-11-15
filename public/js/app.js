console.log('hola desde el frontend')

document.addEventListener('click', e => {
    console.log(e.target.dataset.short)
    if(e.target.dataset.short){
        const url =  `${window.location.origin}/${e.target.dataset.short}`; //window.location.origin--> toma la url actual
        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log('texto copiado al portapapeles')
            })
            .catch((err) => console.log('algo salio mal'+err))
    }
})