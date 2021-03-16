let btnscrap = document.getElementById('btnscrap')

btnscrap.addEventListener('click', async ()=>{
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if(tab!==null){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapingProfile,
          });
    }
})



const scrapingProfile = ()=>{

    const data = {
        personal:{},
        education:[],
        experience:[]
    };

    const wait = function(milliseconds){
        return new Promise(function(resolve){
            setTimeout(function() {
                resolve();
            }, milliseconds);
        });
    };

    window.scrollTo(0,document.body.scrollHeight);
    wait(2000).then(function(){

        const elementNameProfile = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 ul li")
        data.personal.name= elementNameProfile? elementNameProfile.innerText:'';

        const elementNameTitle = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 h2")
        data.personal.title= elementNameTitle? elementNameTitle.innerText:'';

         const elementNameUbicacion = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 ul.pv-top-card--list-bullet li")
        data.personal.location= elementNameUbicacion? elementNameUbicacion.innerText:'';

        wait(2000)
        const elementMoreResume = document.getElementById('line-clamp-show-more-button')
        if(elementMoreResume) elementMoreResume.click();
        const elementResume = document.querySelector('section.pv-about-section > p')
        data.personal.aboutme= elementResume.innerText

        const education = document.querySelector('#education-section').getElementsByTagName('li');

        for(let i=0; i<education.length; i++){
             const company = education[i].querySelector('a > .pv-entity__summary-info  h3').innerText;
             const level = education[i].querySelector('a > .pv-entity__summary-info  p span.pv-entity__comma-item').innerText;
             const period  = education[i].querySelectorAll('div p.pv-entity__dates span')[1]?.innerText||"";
             data.education.push({company,level,period})
        }

        const experience = document.querySelectorAll('#experience-section ul.pv-profile-section__section-info > li');

        for(let i=0; i<experience.length; i++){
             let company = experience[i].querySelectorAll('a > .pv-entity__summary-info p')[1]?.innerText||"";
             if(company.length == 0){
                company = experience[i].querySelectorAll('a  .pv-entity__company-summary-info h3 > span')[1]?.innerText||"";
                let puestos = experience[i].querySelectorAll(' ul.pv-entity__position-group > li');
                let puestos_all = [];
                for(let i=0; i<puestos.length; i++){
                    const cargo = puestos[i].querySelectorAll('div.pv-entity__role-container h3 > span')[1]?.innerText||"";
                    const period = puestos[i].querySelectorAll('div h4.pv-entity__date-range span')[1]?.innerText||"";
                    let selector = puestos[i].querySelector('div p.pv-entity__description');
                    const functions = (selector != null)?selector.innerText:'';
                    puestos_all.push({cargo,period,functions});
                }

                data.experience.push({company,puestos_all});
             }else{
                const period = experience[i].querySelectorAll('a > .pv-entity__summary-info h4 span')[1]?.innerText||"";  
                let selector = experience[i].querySelector('.display-flex p.pv-entity__description');
                const functions = (selector != null)?selector.innerText:'';
                data.experience.push({company,period,functions});
             }
        }
    
        console.log(data)
    });

}