import React from 'react'
import DagField from "../../RoosterStructuur/DagField";
import TimeMarker from "../../RoosterStructuur/TimeMarker";
import '../../Rooster.css'
import LosItemWijzigen, {changeHigerStateFunc} from "../WijzigTijden/LosItemWijzigen";
import {dayRenderItem, roosterItemRenderFunc, UserData} from "../../Rooster Classes/roosterData";
import {TimeMarkerTypes} from "../../RoosterStructuur/TimeMarkerTypes";


interface IProps {
    eindTijd:Date
    beginTijd: Date
    width:number
    apiLink:string
    markerInterval:Date
    changeHigherState:changeHigerStateFunc
    addPopUp:(component:React.ReactElement)=>void
    closePopUp:()=>void
    renderItems:WerknemerRenderObject[]
}

export interface WerknemerRenderObject extends UserData{
    naam:string
    userId:number
    itemId:number
    beginTijd:Date
    eindTijd:Date
    function:roosterItemRenderFunc
}

/*
    Dit component zorgt dat er een timemarker aan de linkerkant komt en er 7 dagen daarnaast staan
    Daarnaast zorgt hij ervoor dat de begintijden en eindtijden op alle velden hetzelfde zijn
    En dat de roosterItems verdeeld worden over de dagen
 */




class DagoverzichtRooster extends React.Component<IProps>{



    render() {
        // Hier wordt berekend hoeveel pixels 1 uur is
        var items:dayRenderItem={}

        var hourHeight=this.props.width/((this.props.eindTijd.getHours()+this.props.eindTijd.getMinutes()/60)-(this.props.beginTijd.getHours()+this.props.beginTijd.getMinutes()/60));

        return(

            <div>
                <div >
                    <tbody>
                        <tr>
                        {/*Hier wordt de zijkant met de tijden gegenereerd  */}
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        <td>
                            <TimeMarker verticaal={true} type={TimeMarkerTypes.time} interval={this.props.markerInterval} beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} lengte={this.props.width} />
                        </td>
                        </tr>
                        {
                            Object.entries(this.props.renderItems).map((value,index) =>{
                                var data=value[1]
                                return (<LosItemWijzigen index={index} itemId={data.itemId} userId={data.userId} naam={data.naam} beginTijd={data.beginTijd.toLocaleTimeString()} eindTijd={data.eindTijd.toLocaleTimeString()} apiLink={this.props.apiLink} changeHigherState={this.props.changeHigherState} >
                                    <DagField renderItems={
                                        // *1 Hier worden alle roosterItems verdeeld over de dagen d.m.v. de datum die in het object stond
                                        //this.props.renderItems[value.toISOString()]||{}
                                        {ditMoet:value[1].function}
                                    } beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} verticaal={true} lengte={this.props.width} markerInterval={this.props.markerInterval}/>
                                </LosItemWijzigen>)
                               /*
                                <tr>
                                    <td><img className="avatar avatarMini" src={this.props.apiLink+"/avatarWithId/"+value[1].userId}/></td>
                                <td>{value[1].naam}</td>
                            <td>  <Create  className="clickAble" onClick={() => {
                            this.props.addPopUp(
                            <ItemWijzigen RoosterData={{beginTijd:value[1].beginTijd.toJSON(),eindTijd:value[1].eindTijd.toJSON(),datum:new Date().toJSON(),UserData:[value[1]]}} apiLink={this.props.apiLink}  close={this.props.closePopUp}/>
                            )
                            }}/></td>

                            <td>

                            </td>
                                </tr>

                                */
                                }
                            )


                        }
                    </tbody>
                </div>
            </div>
            )
    }
}

export default DagoverzichtRooster