import React, { useEffect, useState } from 'react'
import config from '../config'
import '../stylesheets/HomeView.css'

function HomeView() {
    const [productList, setProductList] = useState([])

    useEffect(() => {
        fetch(config.api_url + '/products')
            .then(response => response.json())
            .then(data => {
                console.log(data.products)
                setProductList(data.products)
            })
            .catch(err => console.log(err))
    }, [])


    return (
        <>
            <div className="container">
                <div className="d-flex flex-row flex-wrap">
                    {productList && productList.map(p =>
                        <div key={p.id} className="card w-25 me-1 mb-1 ">
                            <img src={p.image_link} className="card-img-top list-image" alt={p.name} />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <h5>
                                    <span class="badge bg-secondary">
                                        {p.price}$
                                    </span>
                                </h5>
                                <a href="#" className="btn btn-primary">View</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default HomeView