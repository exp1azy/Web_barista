import React, { useState, useEffect, useRef } from "react";
import Multiselect from 'multiselect-react-dropdown';
import { Container, Row, Col, Button } from "react-bootstrap";

import './styles/style.scss';
  
export default (props) => {

    const [assortment, setAssortment] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [foundAssortment, setFoundAssortment] = useState([]);
    const [selectedAssortment, setSelectedAssortment] = useState(null);
    const multiselectRef = useRef();

    const loadData = () => 
        fetch('../data.json')
            .then((response) => response.json())
            .then((data) => {
                setAssortment(data);
                setIngredients([...new Set(data.map((d) => d.ingredients).flat())].sort());
            });

    const findAssortment = () => {
        setFoundAssortment(
            assortment.filter((a) => a.ingredients.length === selectedIngredients.length && a.ingredients.every((i) => selectedIngredients.findIndex((si) => si === i) >= 0))
        );
    };

    const goHome = () => {
        if (multiselectRef.current)
            multiselectRef.current.resetSelectedValues();
        setSelectedIngredients([]);
        setSelectedAssortment(null);
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedIngredients.length > 0) {
            findAssortment();
        } else {
            setFoundAssortment([]);
            loadData();
        }
    }, [selectedIngredients]);

    return (       
        <Container className="app" fluid>
            <Row className="header">
                <Col>Web Barista</Col>
            </Row>
            {selectedAssortment ? (<>
                <Row className="justify-content-md-center">
                    <Col md="6" className="ready">
                        <div><h1><u>{selectedAssortment.title}</u></h1></div>
                        <div><img src={selectedAssortment.image} width="250"></img></div>
                        <div>{selectedAssortment.description}</div>
                        <div><Button onClick={() => goHome()}>Buon appetito</Button></div>
                    </Col>
                </Row>
            </>) : (<>
                <Row className="justify-content-md-center">
                    <Col md="6">
                        <Multiselect id="ingredientsSelect" ref={multiselectRef} options={ingredients} selectedValues={selectedIngredients} placeholder="Выбери ингредиенты"
                            emptyRecordMsg="Нет доступных ингредиентов"
                            isObject={false}
                            onSelect={(selected) => { setSelectedIngredients(selected) }}
                            onRemove={(selected) => { setSelectedIngredients(selected) }}
                            displayValue="label"
                        />
                    </Col>                
                    <Col md="1">
                        <Button title="Очистить ингредиенты"
                            disabled={selectedIngredients.length === 0}
                            onClick={() => goHome()}>
                                x
                        </Button>
                    </Col>   
                </Row>
                { foundAssortment.length > 0 && (
                    <Row className="justify-content-md-center">
                        <Col md="6">
                            <div>Можно приготовить:</div>
                            {foundAssortment.map((a, i) => {
                                return(<div key={`foundAssortment${i}`}>
                                    <Button className="assortment-btn" title="Приготовить"
                                        onClick={ () => setSelectedAssortment(a) }
                                    >
                                        {a.title}
                                    </Button>
                                </div>);
                            })}
                        </Col>
                    </Row>
                )}
            </>)}            
        </Container>
    );
};