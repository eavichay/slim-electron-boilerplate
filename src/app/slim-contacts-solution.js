/**
 * Example of a reusable component - double click enables editing the input
 */
Slim.tag('slim-editable-input', class extends Slim {

    get template() {
        return `<span #label bind>[[text]]</span><input #inp type="text" value=[[text]] />`
    }

    onCreated() {
        this.inp.style.display = 'none'
        this.inp.style.position = 'absolute'
        this.inp.style.left = '0'
        this.inp.style.top = '0'
        this.inp.onblur = this.inp.onchange = () => {
            this.text = this.inp.value
            this.setAttribute('text', this.inp.value)
            this.inp.style.display = 'none'
            this.onchange()
        }
        this.label.ondblclick = () => {
            this.inp.style.display = 'initial'
            this.inp.focus()
        }
    }

})



/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * DONT LOOK BEYOND THIS POINT
 * This is the solution file, try doing it on your own first
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

















/**
 * This is the wrapper for the slim-contacts application.
 */
Slim.tag('slim-contacts', class SlimContacts extends Slim {

    get template() {
        return `
<!-- header of the application, main menu -->
<div class="navbar navbar-default">
    <div class="navbar-header">
        <div class="navbar-brand">Slim Contacts</div>
        <ul class="nav navbar-nav">
            <li><a #btn_add_contact>Add Contact</a></li>
        </ul> 
    </div>
</div>    

<!-- pay attention how repeater works in slim -->
<div class="row">
<slim-contact-view slim-repeat="model.contacts"></slim-contact-view>
</div>
`
    }

    onCreated() {
        this.model = window.ContactsModel
        this.btn_add_contact.onclick = () => {
            this.model.create()
            this.update()
        }

        this.addEventListener('removeContact', contact => {
            this.model.remove(contact)
            // this.update()
        })

        this.addEventListener('changeContact', contact => {
            this.model.save()
        })
    }

    select(contact) {
        this.selected = contact
    }

    onAfterRender() {
        this.find('slim-repeat').onchange = () => {
            setTimeout( () => {
                this.model.sort()
                // this.update()
            }, 0)
        }
    }

})

Slim.tag('slim-rating', class extends Slim {

    get template() {
        return `<div>${this.getStars()}</div>`
    }

    getStars() {
        let res = 'O'
        while (res.length <= this.data.rating) {
            res += 'O'
        }

        while (res.length < 5) {
            res += '-'
        }
        return res
    }

    onAfterRender() {
        this.onclick = () => {
            this.data.rating++
            this.data.rating = this.data.rating % 5
            this.callAttribute('change')
            this.render()
        }

    }


})

Slim.tag('slim-contact-view', class SlimContactView extends Slim {

    get template() {
        return `
<div class="row contact-entry">
<div class="col-xs-1"><input type="button" slim-id="btnRemove" class="btn btn-xs btn-danger" value="X" /> </div>
<div class="col-xs-2"><slim-editable-input text="[[data.first]]" slim-id="inpFirst"></slim-editable-input> <slim-editable-input text="[[data.last]]" slim-id="inpLast"></slim-editable-input></div>
<div class="col-xs-3"><slim-editable-input slim-id="inpEmail"></slim-editable-input></div>
<div class="col-xs-4"><slim-phones slim-id="phones"></slim-phones></div>
<div class="col-xs-2"><slim-rating slim-id="visRating" change="dispatchChange"></slim-rating></div>
</div>`
    }

    onCreated() {
        this.inpEmail.text = this.data.email
        this.inpEmail.onchange = () => {
            this.data.email = this.inpEmail.text
            this.dispatchChange()
        }
        this.inpFirst.onchange = () => {
            this.data.first = this.inpFirst.text
            this.dispatchChange()
        }

        this.inpLast.onchange = () => {
            this.data.last = this.inpLast.text
            this.dispatchChange()
        }

        this.visRating.data = this.data

        this.btnRemove.onclick = () => {
            let e = new Event('removeContact', {bubbles:true})
            e.value = this.data
            this.dispatchEvent(e)
        }

        this.phones.data = this.data.phones
    }

    dispatchChange() {
        let e = new Event('changeContact', {bubbles:true})
        e.value = this.data
        this.dispatchEvent(e)
    }


})

Slim.tag('slim-phones', class extends Slim {
    get template() {
        return `
<div class="row"><input slim-id="btnAddPhone" type="button" class="btn btn-xs btn-primary" value="+ Phone" /></div>
<div class="row"><slim-phone slim-repeat="data"></slim-phone></div>
`
    }

    onCreated() {
        this.btnAddPhone.onclick = () => {
            this.data.push( new window.Phone() )
            this.update()
            window.ContactsModel.save()
        }
    }
})

Slim.tag('slim-phone', class extends Slim {
    get template() {
        return `<div class="col-xs-6"><slim-editable-input slim-id="type"></slim-editable-input></div>
<div class="col-xs-6"><slim-editable-input slim-id="number"></slim-editable-input></div>`
    }

    onCreated() {
        this.type.text = this.data.type
        this.number.text = this.data.number

        this.number.onchange = () => {
            this.data.number = this.number.text
        }

        this.type.onchange = () => {
            this.data.type = this.type.text
        }
    }
})