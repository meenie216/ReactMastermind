"use strict";
// Code goes here

var React = require('react');

    var Game = React.createClass({
      getInitialState: function() {
        return ({
          Guesses: [],
          AllowedColours : this.allowedColours,
          InProgressGuess: [],
          Solution: this.makeNewSolution(),
          WonGame: false
        });
      },
      allowedColours : ["red","blue","yellow","green","black","white"],
      makeNewSolution : function() {
        var countColours = this.allowedColours.length;
        var solution = [];

        for (var i = 0; i < 4; i++) {
          var randomIndex = Math.floor(Math.random() * countColours);
          var randomColour =this.allowedColours[randomIndex];

          solution.push(randomColour);
        };

        return solution;
      },
      buildGuess : function(colour) {
        var guess = this.state.InProgressGuess;
        guess.push(colour);
        if(guess.length > 4) {
          guess =  guess.slice(-4);
        }
        
        this.setState({ InProgressGuess : guess });
      },
      playAgain: function() {
        this.setState(this.getInitialState());
      },
      makeGuess : function() {
        var guess = this.state.InProgressGuess;
        var guesses = this.state.Guesses;
        guesses.push(guess);
        var score =this.scoreGuess(guess);

        var wonGame = (score.length===4 && score[3]==='correct');
        
        this.setState(
            {
              Guesses : guesses,
              InProgressGuess : [],
              WonGame : wonGame
            }
          );
      },
      scoreGuess : function(guessToScore) {
        var guess = guessToScore.slice();
        var solution = this.state.Solution.slice();
        
        var score = [];
        
        // deal with correctly placed items first
        for(var i= 3; i>=0; i--) {
          if(guess[i] === solution[i]) {
            score.push("correct");
           
            guess.splice(i,1);
            solution.splice(i,1);
          }
        }
        
        // check remaing guess to determine if any correct guesses were made but in 
        // the wrong location
        for(var i=0; i< guess.length; i++)
        {
          for(var j=0; j<solution.length; j++) {
            if(guess[i] === solution[j] ) {
              score.push("misplaced");
              solution.splice(j,1);
              break;
            }
          }
        }
        
        return score;       
      },
      render: function() {
        return ( 
          <div id = "game">
            <div className = "clearfix">
              <SolutionFrame solution={this.state.Solution} wonGame={this.state.WonGame} />
              <Guesses guesses = {this.state.Guesses} solution={this.state.Solution} scoreGuess={this.scoreGuess} />
              <GuessBuilder guess={ this.state.InProgressGuess} makeGuess={this.makeGuess } />
              <Buttons wonGame={this.state.WonGame} colours={this.state.AllowedColours} guess = {this.state.Guesses} buildGuess = { this.buildGuess } playAgain = {this.playAgain} />
            </div>
          </div>
        );
      }
    });

    var GuessBuilder = React.createClass({
      render : function() {

        var guess = this.props.guess;
        var disabled = guess.length != 4;
        
        return (
          <span>
            <Guess Guess={ guess } />

            <button className="btn btn-md" onClick={this.props.makeGuess} disabled={ disabled } >
              <span className="glyphicon glyphicon-upload"></span>
            </button>
          </span>
          ); 
      }
    });

    var SolutionFrame = React.createClass({
        render: function() {
          var solution = this.props.solution;
          var style = 'container solution';
          if(!this.props.wonGame) {
            style = style + ' unsolved';
          }

          return ( 
            <div className={style}><Guess Guess={ solution } /></div>
          );
        }
      });

    var Guess = React.createClass({
      render: function() {
        var guess = this.props.Guess;

        if(guess && guess.length >0) {
          var blocks = guess.map(function(i) {
       
            var appliedStyle = "item " + i;
       
            return ( 
                <span className={appliedStyle}> 
                  <span className = "glyphicon glyphicon-tower"></span>
                </span>
            );
          });
          
          return ( <span>{ blocks }</span>);
        } else {
          return (<span></span>);
        }
      }
    });

    var Guesses = React.createClass({
      propTypes : {
          guesses: React.PropTypes.array.isRequired
      },
      render: function() {
        var component = this;
        
      var guessedRendered = this.props.guesses.map(function(guess, i) {
            var score = this.props.scoreGuess(guess);

            return ( 
          <div className="row">
            <span className="col-md-4"><Guess key={'guess' + i} Guess={ guess } /></span> 
            <span className="col-md-1"><GuessScore key={'score' + i} score={score} /></span> 
            <span className="col-md-4"><h2>{i + 1}</h2></span>
          </div>
          );
      }, this).reverse();

        return ( 
            <div className="container board">
              {guessedRendered}
            </div>
        );
      }
    });

    var GuessScore = React.createClass({
      render: function() {
        var score = this.props.score;
        var renderedScore = score.map(function(i) {
          var appliedStyle = "item " + i;
          return (
            <span className={appliedStyle}>
              <span className="glyphicon glyphicon-certificate"></span>
            </span>
            );
        });
        
        return (
          <div className="score">{ renderedScore }</div>
          );
      }
    });


    var ColourButton = React.createClass({
      render : function() {
        var colour = this.props.colour;
        var appliedClass = "btn btn-lg " + colour;
        return (
          <button className = {appliedClass}  onClick = {this.props.buildGuess.bind(null, colour) }>
            <span className = "glyphicon glyphicon-tower"></span> 
          </button>
          );
      }
    });

    var Buttons = React.createClass({
      render: function() {

        var wonGame = this.props.wonGame;

        if(!wonGame) {
          var buildGuess = this.props.buildGuess;
          var colours = this.props.colours;
          var buttons = colours.map(function(i) {
            return ( <ColourButton key={i} colour={ i } buildGuess = { buildGuess } />);
          });
          
          return ( 
            <div className = "well">
              { buttons }
              <button className="btn btn-warning" onClick={this.props.playAgain} >
                <span className="glyphicon glyphicon-refresh"></span>
                &nbsp;Start Over
              </button>
            </div >
          );
        } else {
          return (
            <div className="jumbotron">
              <h2>You Win!</h2>
              <button className="btn btn-lg" onClick={this.props.playAgain}>Play Again?</button>
            </div>
            );
        }
      }
    });


module.exports = Game;
