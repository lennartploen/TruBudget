import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { connect } from "react-redux";

import { toAmountString, toJS } from "../../helper";
import { getSubProjectKPIs, resetKPIs } from "./actions";
import strings from "../../localizeStrings";

/**
 * SubprojectAnalytics should provide a dashboard which visualizes aggregate informations about the selected Subproject
 * - Projected Budget: Planned budget according to agreements and other budget planning documents.
 * - Assigned Budget: "Calculation : Sum of assigned budgets of subproject (only of closed workflow items).
 *   May exceed (projected) budget (subproject) Definition : Budget reserved for one specific activity as fixed in contract with subcontrator."
 * - Disbursed Budget: Sum of payments of subproject (only of closed workflow items). Not allowed to exceed assigned budget.
 * - Indication Assigned Budget: Assigned budget / projected budget
 * - Indication Disbursed Budget:  Disbursed budget / assigned budget
 */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column"
  },
  charts: {
    marginLeft: "20%",
    marginRight: "20%",
    marginBottom: "20%"
  },
  table: {
    width: "80%",
    margin: "auto"
  },
  statistics: {
    padding: "12px"
  },
  topContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "24px"
  }
};

class SubprojectAnalytics extends React.Component {
  componentDidMount() {
    this.props.getSubProjectKPIs(this.props.projectId, this.props.subProjectId);
  }
  componentWillUnmount() {
    this.props.resetKPIs();
  }

  convertToSelectedCurrency(amount, sourceCurrency) {
    const sourceExchangeRate = this.props.exchangeRates[sourceCurrency];
    const targetExchangeRate = this.props.exchangeRates[this.props.indicatedCurrency];
    return sourceExchangeRate && targetExchangeRate ? targetExchangeRate / sourceExchangeRate * parseFloat(amount) : 0;
  }

  convertProjectedBudget() {
    return this.props.projectedBudgets.map(pb => {
      return {
        ...pb,
        convertedAmount: this.convertToSelectedCurrency(pb.value, pb.currencyCode)
      };
    });
  }

  render() {
    const { subProjectCurrency = "EUR", assignedBudget, disbursedBudget, indicatedCurrency } = this.props;
    const projectedBudgets = this.convertProjectedBudget();
    const projectedBudget = projectedBudgets.reduce((acc, next) => {
      return acc + next.convertedAmount;
    }, 0);
    const convertedAssignedBudget = this.convertToSelectedCurrency(assignedBudget, subProjectCurrency);
    const convertedDisbursedBudget = this.convertToSelectedCurrency(disbursedBudget, subProjectCurrency);
    return this.props.canShowAnalytics ? (
      <div>
        <div style={styles.container}>
          <div style={styles.topContainer}>
            <div style={styles.table}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{strings.common.organization}</TableCell>
                    <TableCell align="right">{strings.amount}</TableCell>
                    <TableCell align="right">{strings.common.currency}</TableCell>
                    <TableCell align="right">{strings.workflow.exchange_rate}</TableCell>
                    <TableCell align="right">{strings.analytics.convertedAmount}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectedBudgets.map(budget => (
                    <TableRow key={budget.organization + budget.currencyCode}>
                      <TableCell>{budget.organization}</TableCell>
                      <TableCell align="right">{toAmountString(budget.value)}</TableCell>
                      <TableCell align="right">{budget.currencyCode}</TableCell>
                      <TableCell align="right">
                        {this.convertToSelectedCurrency(1, budget.currencyCode).toFixed(4)}
                      </TableCell>
                      <TableCell align="right">{toAmountString(budget.convertedAmount, indicatedCurrency)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell align="right">{toAmountString(projectedBudget, indicatedCurrency)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <Dashboard
            indicatedCurrency={this.props.indicatedCurrency}
            projectedBudget={projectedBudget}
            projectedBudgets={projectedBudgets}
            disbursedBudget={convertedDisbursedBudget}
            assignedBudget={convertedAssignedBudget}
          />
        </div>
      </div>
    ) : this.props.canShowAnalytics === undefined ? null : (
      <div>Insufficient permissions.</div>
    );
  }
}

const dashboardStyles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  card: {
    width: "300px",
    height: "300px",
    margin: "12px"
  },
  ratioContent: {
    height: "87%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  numberContent: {
    height: "87%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  chartContent: {
    height: "87%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

const NumberChart = ({ title, budget, currency }) => (
  <Card style={dashboardStyles.card}>
    <CardContent style={dashboardStyles.numberContent}>
      <Typography style={{ flex: 1 }} variant="overline">
        {title}
      </Typography>
      <Typography style={{ flex: 1 }} variant="h6">
        {toAmountString(budget, currency)}
      </Typography>
    </CardContent>
  </Card>
);
const RatioChart = ({ title, budget }) => (
  <Card style={dashboardStyles.card}>
    <CardContent style={dashboardStyles.ratioContent}>
      <Typography style={{ flex: 1 }} variant="overline">
        {title}
      </Typography>
      <Typography style={{ flex: 1 }} variant="h6">
        {budget ? `${(budget * 100).toFixed(2)}%` : "-"}
      </Typography>
    </CardContent>
  </Card>
);

const Chart = ({ title, chart }) => (
  <Card style={dashboardStyles.card}>
    <CardContent style={dashboardStyles.chartContent}>
      <Typography variant="overline">{title}</Typography>
      <div style={{ flex: 1 }}>{chart}</div>
    </CardContent>
  </Card>
);

const Dashboard = ({ indicatedCurrency, projectedBudgets, projectedBudget, assignedBudget, disbursedBudget }) => {
  return (
    <div style={dashboardStyles.container}>
      <Chart
        title="Projected Budgets Distribution"
        chart={
          <Doughnut
            data={{
              labels: projectedBudgets.map(tb => tb.organization),
              datasets: [
                {
                  data: projectedBudgets.map(tb => tb.convertedAmount),
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(153, 102, 255, 0.8)",
                    "rgba(255, 159, 64, 0.8)"
                  ]
                }
              ]
            }}
            options={{
              tooltips: {
                callbacks: {
                  label: (item, data) => {
                    return toAmountString(data.datasets[item.datasetIndex].data[item.index], indicatedCurrency);
                  }
                }
              }
            }}
          />
        }
      />
      <NumberChart title={strings.common.projected_budget} budget={projectedBudget} currency={indicatedCurrency} />
      <NumberChart title={strings.common.assigned_budget} budget={assignedBudget} currency={indicatedCurrency} />
      <NumberChart title={strings.common.disbursed_budget} budget={disbursedBudget} currency={indicatedCurrency} />
      <RatioChart title={strings.analytics.assigned_budget_ratio} budget={assignedBudget / projectedBudget} />
      <RatioChart title={strings.analytics.disbursed_budget_ratio} budget={disbursedBudget / assignedBudget} />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    subProjectCurrency: state.getIn(["analytics", "subproject", "currency"]),
    indicatedCurrency: state.getIn(["analytics", "currency"]),
    projectedBudgets: state.getIn(["analytics", "subproject", "projectedBudgets"]),
    assignedBudget: state.getIn(["analytics", "subproject", "assignedBudget"]),
    disbursedBudget: state.getIn(["analytics", "subproject", "disbursedBudget"]),
    exchangeRates: state.getIn(["analytics", "exchangeRates"]),
    canShowAnalytics: state.getIn(["analytics", "canShowAnalytics"])
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSubProjectKPIs: (projectId, subprojectId) => dispatch(getSubProjectKPIs(projectId, subprojectId)),
    resetKPIs: () => dispatch(resetKPIs())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(SubprojectAnalytics));
