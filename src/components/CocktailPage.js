import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Definition from "./CocktailPage/Definition";
import IngredientDetail from "./IngredientDetail";
import { bindActionCreators } from "redux";
import { enrichCocktail } from "../actions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import CocktailVariant from "./CocktailPage/CocktailVariant";
import CocktailImage from "./CocktailPage/CocktailImage";
const styles = theme => ({
  paper: {
    margin: 0,
    padding: "1em 2em",
    marginBottom: "1em"
  },
  innerContainer: {
    padding: "0 2.7em"
  },
  root: {
    ...theme.mixins.gutters,
    justifyContent: "center"
  },
  gridList: {
    justifyContent: "center"
  },
  definitions: {
    marginTop: "1.5em"
  },
  progress: {
    width: "100%"
  }
});

const CocktailPage = ({ allCocktails, enrichCocktail, classes, match }) => {
  const cocktail = allCocktails.find(c => c.slug === match.params.slug);
  if (!cocktail) return null;

  const { enriched, enriching, enrichmentFailed } = cocktail;

  if (!enriching && !enriched && !enrichmentFailed) enrichCocktail(cocktail);

  const {
    name,
    ingredients,
    preparation,
    category,
    glass,
    garnish,
    enrichment
  } = cocktail;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} square>
        <Grid container className={classes.innerContainer} spacing={16}>
          <Grid item md={8} xs={12}>
            <Typography variant="h2" gutterBottom>
              {name}
            </Typography>
            <Typography component="ul" gutterBottom>
              <>
                {ingredients.map((ingredient, idx) => {
                  return (
                    <li key={`ingredient-${idx}`}>
                      <IngredientDetail item={ingredient} />
                    </li>
                  );
                })}
              </>
            </Typography>
            <Typography
              className={classes.definitions}
              component="dl"
              gutterBottom
            >
              <>
                <Definition title="Category" description={category} />
                <Definition title="Glass" description={glass} />
                <Definition title="Preparation" description={preparation} />
                <Definition title="Garnish" description={garnish} />
                {enriched && enrichment.ibaCategory && (
                  <Definition
                    title="IBA Category"
                    description={enrichment.ibaCategory}
                  />
                )}
              </>
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <div style={{ textAlign: "center" }}>
              {enriching && (
                <CircularProgress size="50%" className={classes.progress} />
              )}
              {enriched && enrichment.image && (
                <div style={{ marginRight: "1em" }}>
                  <CocktailImage image={enrichment.image} name={name} />
                </div>
              )}
            </div>
          </Grid>
        </Grid>
        <br />

        {enriched && enrichment.variants && enrichment.variants.length > 0 && (
          <>
            <Typography
              style={{ marginTop: "1em", paddingLeft: "0.7em" }}
              variant="h2"
              gutterBottom
            >
              Variants
            </Typography>

            <GridList className={classes.gridList}>
              {enrichment.variants.map(variant => {
                return (
                  <CocktailVariant key={variant.name} cocktail={variant} />
                );
              })}
            </GridList>
          </>
        )}
      </Paper>
    </div>
  );
};

const mapStateToProps = state => ({
  allCocktails: state.db.cocktails,
  allIngredients: state.db.ingredients
});

const mapDispatchToProps = dispatch => ({
  enrichCocktail: bindActionCreators(enrichCocktail, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CocktailPage));
