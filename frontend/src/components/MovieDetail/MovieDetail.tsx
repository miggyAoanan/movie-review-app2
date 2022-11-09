import React, { useState, useMemo, useEffect } from "react";
import "./MovieDetail.scss";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector ,RootState} from '../../store/store'
import { getMovie } from "../../redux/movieSlice";
import ActorCard from "../ActorCard/ActorCard";
import { Rating } from 'react-simple-star-rating'
import { addMovieReview, AddReviewArgs } from '../../redux/reviewSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Actor, Review} from "../../interfaces";


function MovieDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.movies.movie)
  const moviesState = useAppSelector((state: RootState) => state.movies)
  const [userRating, setUserRating] = useState(0)
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (id) {
      dispatch(getMovie(id))
    }
  }, [id, dispatch])

  const movie = useMemo(() => data, [data])
  let movieName = movie?.title
  let renderActors  = movie?.actors?.map((actor:Actor, index:number) => (<ActorCard key={index} {...actor} />))

  let renderActorsList  = movie?.actors?.map((act:Actor, index:number) => (

    <ul className="actorList">
      <li key={index}> {act.firstName} &nbsp; {act.lastName}</li>

    </ul>
  ))

  let filteredReviews  = movie?.reviews?.filter((rev:Review) => rev.isActive !== false)
  let renderReviews  = filteredReviews?.map((review:Review, index:number) => (

    <div key={index} className="reviewDiv">
      <span className="reviewRating">
        <Rating
          size={20}
          initialValue={Math.round(review.rating)}
        />
      </span>
      <p className="reviewDesc"> {review.description} </p>
      <p className="userDetail">{review.userName} </p>
    </div>

  ))

  const handleRating = (rate: number) => {
    setUserRating(rate)
  }

  const handleChangetextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
  }
  const onSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user")!)
    const userPermission = user.permissions;
    const userId = user.id;
    const userName = user.fullName;
    const movieId = id;
    const reviewData: AddReviewArgs = { description, rating: userRating, movieId, movieName, userId, userName }


    if (userPermission === "user") {
      if (userRating === 0) {
        toast.error("Please add a rating")
      } else if (description === "") {
        toast.error("Please add review details")
      } else {
        dispatch(addMovieReview(reviewData)).then((res:any) => {
          toast.warning("Review awaiting for moderation")
        })
      }

    } else if (userPermission === "admin") {
      toast.error("Admin cannot add a review")
    } else {
      toast.error("You need to login to add a review")
    }

  }

  //ratings of the approve reviews
  let ratings: number[] = [];

  filteredReviews?.map((revs: Review) => {
    ratings.push(revs.rating)
  })

  let aveRatings = 0;

  let small
  if (ratings.length) {
    aveRatings = ratings?.reduce((total, current) => total + current) / ratings.length
    small = Number(aveRatings.toPrecision(2))
  }


  return (
    <>
      <div className="movie-section">
        {moviesState.loading === true ? (
          <div>...Loading</div>
        ) : (
          <>
            <div className="section-left">
              <div className="topSectionLeft">
                <div className="movie-title">{movie?.title}</div>
                <div className="movie-rating mb-5">             
                  <span>
                    IMDB Rating <i className="fa fa-star"></i> : {small}
                  </span>
                  <span>
                    Budget <i className="fa-light fa-sack-dollar"></i> : {movie?.cost}
                  </span>

                  <span>
                    Year <i className="fa fa-calendar"></i> : {movie?.year}
                  </span>
                </div>
              </div>
              <div className="imageSection">
                <img src={movie?.imageURL} alt={movie?.title} className="movieImage" />
              </div>


            </div>
            <div className="section-right">
              <div className="movie-info">
                <h2 className="mt-5"> Overview</h2>
                <p>{movie?.overview}</p>

                <div className="actorListContainer">

                  Actors:{renderActorsList}
                </div>
              </div>

              <div className="review-container">

                <h2 className="mt-5"> User Reviews</h2>
                {renderReviews ?  renderReviews : (<p className="mt-4 mb-4">No User Reviews </p>)}

              </div>

              <div className="formreviewContainer mt-4">
                <div className="starRatingDiv mb-2">
                  <Rating
                    onClick={handleRating}
                    size={25}
                    initialValue={1}
                  />
                </div>

                <div className="input-group mb-2 mt-4">
                  <span className="input-group-text">Add a review</span>
                  <textarea 
                  className="form-control" 
                  aria-label="Add a review"
                   onChange={handleChangetextArea}
                   placeholder="This is the best movie ever"
                   ></textarea>
                </div>

                <div className="d-grid gap-2 mt-2">
                  <button className="btn btn-secondary btn-sm" type="button"
                    onClick={onSubmit}
                  >Add a review</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="actorContainer mb-2">
        <h2 className="text-white mt-4 mb-2">Cast</h2>
        <div className="actor-container mb-4">
          {renderActors ? renderActors : (<p className="text-white"> No Actors Found</p>)}
        </div>

      </div>
      <ToastContainer />
    </>

  );
}

export default MovieDetail;