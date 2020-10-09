import React, {useState, useEffect} from 'react';
import Axios from 'axios';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const pages = getRandomInt(1, 1000);
const apiServer = "http://3.34.202.83";

export default function Labelling(props) {
    const [labeled, setLabeled] = useState(0);
    const [posts, setPosts] = useState(0);

    useEffect(() => {
        if (!posts) {
            var url = apiServer + "/api/v2/get/posts/"+ pages +"/0";
            Axios.get(url)
                .then((res) => {
                    console.log(res);
                    if (res.data.data.length)
                        setPosts(res.data.data);
                    else {
                        alert("로드 실패. reload!");
                        window.location.reload();
                    }
                })
        }
    }, [posts]);

    useEffect(() => {
        var url = apiServer + "/api/v2/label/status";
        Axios.get(url)
            .then((res) => {
                console.log(res);
                setLabeled(res.data.data);
            })
    }, [labeled])

    return <div>
        <div style={style_Navigation_Shadow}></div>
        {
            posts ? <POSTWrapper data={posts} /> : <></>
        }
    </div>
}

const style_Navigation_Shadow = {
    height: "96px"
}
function POSTWrapper({ data }) {
    const [success_many, setSuccess_many] = useState(0);

    useEffect(() => {
        if (success_many === data.length) {
            alert("라벨링 전체 전송 완료!");
            window.location.reload();
        }
    }, [success_many, data])
    var Refs = [];

    for (let i = 0; i < data.length; i++) {
        Refs.push(React.createRef());
    }

    function submit() {
        Refs.every((data, index) => {
            data.current.submit(index);

            return true;
        })
    }

    function success() {
        setSuccess_many(success_many + 1);
    }

    return <div className="POST-Wrapper">
        {
            data ? data.map((data, index) => <POST ref={Refs[index]} success={success} key={index} postData={data} />) : null
        }
        <div style={{margin: "16px"}}></div>
        <button variant="contained" color="primary" onClick={submit}>
            전체 라벨링 완료
        </button>
    </div>
}

class POST extends React.Component {
    constructor(props) {
        super(props);
        this.colorDefalutValue = props.postData.label ? "#FF0000" : "#00FF00";
        this.state = {
            color: this.colorDefalutValue,
        }
        this.postRef = React.createRef();
    }

    toggleColor = () => {
        var color = this.state.color;
        var newColor;
        if (color === "#FF0000") newColor = "#00FF00";
        else if (color === "#00FF00") newColor = "#FBB117";
        else newColor = "#FF0000";

        this.setState({
            color: newColor
        })
        this.postRef.current.style.backgroundColor = newColor;
    }

    componentDidMount() {
        this.postRef.current.style.backgroundColor = this.state.color;
    }

    getLabel = () => {
        var color = this.state.color;

        if (color === "#FF0000")
            return 1;
        else if (color === "#00FF00")
            return 0;
        else
            return -1;
    }

    submit = () => {
        var doc_id = this.props.postData._id;
        var url = window.serverUrl + "/api/v2/set/label";
        var form = {
            "document_id": doc_id,
            "label": this.getLabel()
        }

        console.log(form);
        Axios.post(url, form)
        .then((res) => {
            if (this.props.success)
                this.props.success();
            console.log(res);
        })
    }

    render() {
        var postData = this.props.postData;

        return <div style={postWrapperStyle}>
            <div ref={this.postRef} onClick={this.toggleColor}>
                <p style={POST_STYLE}>{postData.string}</p>
            </div>
            <button size="small" variant="contained" color="primary" onClick={this.submit}>
                라벨링 완료
            </button>
        </div>
    }
}

const postWrapperStyle = {

}

const POST_STYLE = {
    marginTop: "24px",
    padding: "8px",
    border: "1px solid grey",
    fontSize: "16px",
    fontWeight: "bold"
}