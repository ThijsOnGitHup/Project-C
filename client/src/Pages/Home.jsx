import React from 'react'
import {Link} from "react-router-dom";


class Home extends React.Component{
    constructor(props){
        super(props);

        }


    render(){
        return (
            <div className="base-container" ref={this.props.containerRef}>
                <div className="header">login</div>
                <div className="content">
                    <br/>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" placeholder="username" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" placeholder="password" />
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button type="button" className="btn">
                        Login
                    </button>
                </div>
            </div>
        );
    }
}
export default Home