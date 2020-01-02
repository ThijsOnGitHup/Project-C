import React from "react";

interface IProps {
    apiLink:string
}

interface IState {
    NextShift:{datum:string, beginTijd:string, eindTijd:string}
}

class NextShift extends React.Component<IProps, IState> {
    constructor(props:IProps){
        super(props);
        this.state={
            NextShift:{
                datum:"",
                beginTijd:"",
                eindTijd:""
            }
        }
    }
    componentDidMount() {
        this.getNextShift()
    }

    getNextShift = () => {
        fetch("http://localhost:5000/api/getNextShift", {headers:{authToken:sessionStorage.getItem('authToken')}})
            .then(
                (u) => {
                    try{
                        return u.json()
                    }
                    catch(error){
                        console.error(error)
                    }
                }
            )
            .then(
                (json) => {
                    console.log(json);
                    this.setState({NextShift:json[0]})
                }
            )
    };
    render() {
        return(
            <div className='NextShift'>
                <p>{(this.state.NextShift) ? new Date(this.state.NextShift.datum).toLocaleDateString("nl-NL", {weekday:"long", day:"numeric", month:"long", year:"numeric"}):"Je hebt geen volgende dienst."}</p>
                <p>van {(this.state.NextShift) ? new Date(this.state.NextShift.beginTijd).toLocaleTimeString("nl-NL", {hour: '2-digit', minute:'2-digit'}) : "--:--"} tot {(this.state.NextShift) ? new Date(this.state.NextShift.eindTijd).toLocaleTimeString("nl-NL", {hour: '2-digit', minute:'2-digit'}): "--:--"}</p>
            </div>
        )
    }
}

export default NextShift