import React, {MouseEventHandler} from 'react';
import {Link} from "react-router-dom";
import ProfielFotoBijsnijder from "../Components/ProfielFotoBijsnijder";

interface IState {
    // Globale variabelen.
    firstName: string,
    lastName: string,
    email: string,
    pass: string,
    phone: string,
    birth: string,
    foto:string,
    isWerkgever: boolean,
    roosterName: string,
    koppelCode: string,
    // Beschrijf de toegestane symbolen voor de inputvelden.
    letters: RegExp,
    numbers: RegExp,
    // Sla op of inputvelden al zijn aangeraakt door de gebruiker.
    touched: {
        firstName: boolean,
        lastName: boolean,
        email: boolean,
        pass: boolean,
        phone: boolean,
        birth: boolean,
        roosterName: boolean,
        koppelCode: boolean
    },
    fotoFile:File,
    blackCircle:boolean,
    getImage:()=>Promise<Blob>
}

interface IProps {
    apiLink:string
}

class Registratie extends React.Component<IProps,IState>{
    private lijst:(keyof IState)[];

    constructor(props:IProps){
        super(props);
        this.state = {
            // Globale variabelen.
            firstName: 'Berend',
            lastName: 'Doornbos',
            email: 'roosteritHRO@gmail.com',
            pass: '123',
            phone: '0616794973',
            birth: '1998-01-18',
            foto:"",
            isWerkgever: true,
            roosterName: 'AYE',
            koppelCode: '12345',
            // Beschrijf de toegestane symbolen voor de inputvelden.
            letters: /^[A-Za-z]+$/,
            numbers: /^[0-9]+$/,
            // Sla op of inputvelden al zijn aangeraakt door de gebruiker.
            touched: {
                firstName: false,
                lastName: false,
                email: false,
                pass: false,
                phone: false,
                birth: false,
                roosterName: false,
                koppelCode: false
            },
            fotoFile:null,
            blackCircle:true,
            getImage:null
        };
        // Lijst om uit te lezen voor het POST request.
        this.lijst = ["firstName", "lastName", "email", "pass", "phone", "birth", "isWerkgever"];
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Controlleer of de waarden in een veld wel verstuurd kunnen worden.
    canBeSubmitted() {
        const errors = this.validate(this.state.firstName, this.state.lastName, this.state.email, this.state.pass, this.state.phone, this.state.birth, this.state.roosterName, this.state.koppelCode);
        const isDisabled = Object.values(errors).some(value => value);
        return !isDisabled;
    }

    // Ververs de waarden wanneer deze veranderd worden door de gebruiker.
    handleInputChange(event:React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        // Laat de waarde de waarde zijn van het actieve veld. Als het input-type een checkbox is is de waarde of deze aangevinkt is of niet.
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if(target.type==="file"){
            this.setState<never>({[name+"File"]:target.files[0]})
        }
        this.setState<never>({[name]: value});
    }

    // Verander de waarde van touched voor een inputveld naar true.
    handleBlur = (field:string) => (event:React.FocusEvent) => {
        this.setState({
            touched: {...this.state.touched, [field]: true},
        });
    };

    validate(firstName:string, lastName:string, email:string, pass:string, phone:string, birth:string, roosterName:string, koppelCode:string) {
        // Als een waarde hier true is betekent dat dat het veld niet valide is.
        return {
            firstName: firstName.length === 0 || firstName.length >= 30 || !firstName.match(this.state.letters),
            lastName: lastName.length === 0 || lastName.length >= 30 || !lastName.match(this.state.letters),
            email: email.length === 0 || email.length >= 30,
            pass: pass.length === 0 || pass.length >= 30,
            phone: phone.length === 0 || phone.length >= 20 || !phone.match(this.state.numbers),
            birth: birth.length === 0,
            roosterName: this.state.isWerkgever && roosterName.length === 0,
            koppelCode: koppelCode.length === 0
        };
    }

    // Converteer de waarden uit de state naar een JSON string om die in een POST request te plaatsen en te versturen.
    handleSubmit = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        // Laat de data niet verstuurd worden wanneer de input validatie niet succesvol is.
        if (!this.canBeSubmitted()) {return;}

        let object= {};
        this.lijst.forEach(value=>{
            let val = this.state[value];
            let returnValue;
            if (typeof returnValue === 'boolean') {
                returnValue = val ? 1 : 0
            } else if (value === "birth" && typeof val === "string") {
                returnValue = new Date(returnValue).toLocaleDateString('en-US',{year:'2-digit', month:"2-digit", day:"2-digit", timeZone:"UTC"})
            } else {
                returnValue = val.toString()
            }
            object = returnValue;
        });

        let wachten = await this.setState({blackCircle:false});
        let image = await this.state.getImage();
        console.log("sending");

        let formData = new FormData();
        formData.append("profielFoto",image);
        this.lijst.forEach( value => {
            let val = this.state[value];
            formData.append(value, val.toString())
        });

        // Voeg de gebruiker toe aan de database.
        fetch(this.props.apiLink+"/addgebruiker",{
            method:'POST',
            body:formData
        }).then(value => console.log(value));

        // Maak een nieuw rooster aan in de database.
        if (this.state.isWerkgever) {
            fetch(this.props.apiLink + "/addrooster", {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({roosterName: this.state.roosterName})
            }).then(value => console.log(value));
        }
    };

    // Verzamel de inputs van de gebruiker om die in de state op te slaan.
    render() {
        type fields = {birth: boolean, email: boolean, firstName: boolean, lastName: boolean, pass: boolean, phone: boolean, roosterName: boolean, koppelCode: boolean}
        const errors:fields = this.validate(this.state.firstName, this.state.lastName, this.state.email, this.state.pass, this.state.phone, this.state.birth, this.state.roosterName, this.state.koppelCode);
        const isDisabled = Object.values(errors).some(value => value);

        // Valideer of een fout getoond zou moeten worden.
        const shouldMarkError = (field: keyof typeof errors) => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];
            return hasError ? shouldShow : false;
        };

    // Verzamel de inputs van de gebruiker om die in de state op te slaan.
    // Als er een foto is geselecteerd wordt hieruit een afbeelding aangemaakt.
        return(
        <div id="reg">
                <form>
                <table>
                <tbody>
                <tr>
                    <h1>Registratie</h1>
                </tr>
                <tr>
                    <label>Preview Profielfoto</label>
                    <td><ProfielFotoBijsnijder size={350} blackCircle={this.state.blackCircle} setImageGetFunction={(functie)=>{this.setState({getImage:functie})}} image={this.state.fotoFile}/></td>
                </tr>
                <tr>
                    <label>Upload Profielfoto</label>
                    <td><input type="file" accept={"image/*"}  onChange={this.handleInputChange} name="foto"/></td>
                </tr>
                <tr>
                    <label>Voornaam</label>
                    <td><input className={shouldMarkError('firstName') ? "error" : ""}
                               onBlur={this.handleBlur('firstName')}
                               type='text' name="firstName" value={this.state.firstName} placeholder="Voornaam" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Achternaam</label>
                    <td><input className={shouldMarkError('lastName') ? "error" : ""}
                               onBlur={this.handleBlur('lastName')}
                               type='text' name="lastName" value={this.state.lastName} placeholder="Achternaam" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Email</label>
                    <td><input className={shouldMarkError('email') ? "error" : ""}
                               onBlur={this.handleBlur('email')}
                               type='email' name="email" value={this.state.email} placeholder="Email" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Telefoonnummer</label>
                    <td><input className={shouldMarkError('phone') ? "error" : ""}
                               onBlur={this.handleBlur('phone')}
                               type='text' name="phone" value={this.state.phone} placeholder="Telefoonnummer" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Geboortedatum</label>
                    <td><input className={shouldMarkError('birth') ? "error" : ""}
                               onBlur={this.handleBlur('birth')}
                               type='date' name="birth" value={this.state.birth} placeholder="Geboortedatum" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Wachtwoord</label>
                    <td><input className={shouldMarkError('pass') ? "error" : ""}
                               onBlur={this.handleBlur('pass')}
                               type='password' name="pass" value={this.state.pass} placeholder="Wachtwoord" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Account voor werkgever</label>
                    <td><input type='checkbox' name="isWerkgever" checked={this.state.isWerkgever} placeholder="false" onChange={this.handleInputChange}/></td>
                </tr>

                { this.state.isWerkgever ?
                    <tr>
                        <label>Roosternaam</label>
                        <td><input className={shouldMarkError('roosterName') ? "error" : ""}
                                   onBlur={this.handleBlur('roosterName')}
                                   type='text' name="roosterName" value={this.state.roosterName} placeholder="Roosternaam" onChange={this.handleInputChange}/></td>
                    </tr> : ''
                }
                { this.state.isWerkgever ?
                    <tr>
                        <label>Koppelcode</label>
                        <td><input name="koppelCode" value={this.state.koppelCode}/></td>
                    </tr>
                    :
                    <tr>
                        <label>Koppelcode</label>
                        <td><input className={shouldMarkError('koppelCode') ? "error" : ""}
                                   onBlur={this.handleBlur('koppelCode')}
                                   type='text' name="koppelCode" value={this.state.koppelCode} placeholder="Koppelcode" onChange={this.handleInputChange}/></td>
                    </tr>
                }

                <button disabled={isDisabled} onClick={this.handleSubmit}>Registreer</button>
                </tbody>
            </table>
            </form>
        </div>
        )
    }
}

export default Registratie
