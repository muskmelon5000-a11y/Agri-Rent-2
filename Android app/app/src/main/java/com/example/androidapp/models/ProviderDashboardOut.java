package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class ProviderDashboardOut {
    @SerializedName("total_earnings_month")
    private double totalEarningsMonth;

    @SerializedName("earnings_change_pct")
    private double earningsChangePct;

    @SerializedName("active_rentals")
    private int activeRentals;

    @SerializedName("completed_jobs")
    private int completedJobs;

    @SerializedName("pending_requests")
    private int pendingRequests;

    @SerializedName("weekly_chart")
    private List<EarningsDay> weeklyChart;

    @SerializedName("top_machine_name")
    private String topMachineName;

    @SerializedName("top_machine_image")
    private String topMachineImage;

    @SerializedName("top_machine_earnings")
    private Double topMachineEarnings;

    @SerializedName("top_machine_rentals")
    private Integer topMachineRentals;

    // Getters and Setters
    public double getTotalEarningsMonth() { return totalEarningsMonth; }
    public void setTotalEarningsMonth(double totalEarningsMonth) { this.totalEarningsMonth = totalEarningsMonth; }

    public double getEarningsChangePct() { return earningsChangePct; }
    public void setEarningsChangePct(double earningsChangePct) { this.earningsChangePct = earningsChangePct; }

    public int getActiveRentals() { return activeRentals; }
    public void setActiveRentals(int activeRentals) { this.activeRentals = activeRentals; }

    public int getCompletedJobs() { return completedJobs; }
    public void setCompletedJobs(int completedJobs) { this.completedJobs = completedJobs; }

    public int getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(int pendingRequests) { this.pendingRequests = pendingRequests; }

    public List<EarningsDay> getWeeklyChart() { return weeklyChart; }
    public void setWeeklyChart(List<EarningsDay> weeklyChart) { this.weeklyChart = weeklyChart; }

    public String getTopMachineName() { return topMachineName; }
    public void setTopMachineName(String topMachineName) { this.topMachineName = topMachineName; }

    public String getTopMachineImage() { return topMachineImage; }
    public void setTopMachineImage(String topMachineImage) { this.topMachineImage = topMachineImage; }

    public Double getTopMachineEarnings() { return topMachineEarnings; }
    public void setTopMachineEarnings(Double topMachineEarnings) { this.topMachineEarnings = topMachineEarnings; }

    public Integer getTopMachineRentals() { return topMachineRentals; }
    public void setTopMachineRentals(Integer topMachineRentals) { this.topMachineRentals = topMachineRentals; }
}
