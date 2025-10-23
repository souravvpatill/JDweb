import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

def analyze_wage_gap(file_location):
    print("Starting the analysis. Let's load the dataset...")
    try:
        wage_gap_df = pd.read_csv(file_location)
        print("Dataset loaded successfully!\n")
    except FileNotFoundError:
        print(f"Error: Could not find the file at {file_location}.")
        print("Please check that the file path is correct.")
        return

    print("Now, let's clean up the data for analysis...")
    clean_df = wage_gap_df.copy()
    clean_df.rename(columns={'Gender wage gap %': 'wage_gap_percent'}, inplace=True)
    clean_df.drop(columns=['Code'], inplace=True, errors='ignore')
    clean_df.dropna(subset=['wage_gap_percent'], inplace=True)
    clean_df['wage_gap_percent'] = pd.to_numeric(clean_df['wage_gap_percent'])
    print("Data cleaning complete. Here's a quick look at the data:")
    print(clean_df.head())
    print("\n" + "~"*50 + "\n")

    print("Here are the key summary statistics for the wage gap data:")
    print(clean_df['wage_gap_percent'].describe())
    print("\n" + "~"*50 + "\n")

    print("Numbers are great, but charts tell a better story. Generating visuals...")
    sns.set_theme(style="ticks", palette="pastel")

    plt.figure(figsize=(10, 6))
    sns.histplot(data=clean_df, x='wage_gap_percent', kde=True, bins=30)
    plt.title('Overall Distribution of Gender Wage Gap Data', fontsize=16)
    plt.xlabel('Gender Wage Gap (%)')
    plt.ylabel('Count of Occurrences')
    plt.show()

    yearly_average = clean_df.groupby('Year')['wage_gap_percent'].mean().reset_index()
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=yearly_average, x='Year', y='wage_gap_percent', marker='o', color='b')
    plt.title('How the Average Gender Wage Gap Has Changed Over Time', fontsize=16)
    plt.xlabel('Year')
    plt.ylabel('Average Wage Gap (%)')
    plt.grid(True)
    plt.show()

    avg_gap_by_nation = clean_df.groupby('country')['wage_gap_percent'].mean().nlargest(10)
    plt.figure(figsize=(12, 8))
    sns.barplot(x=avg_gap_by_nation.values, y=avg_gap_by_nation.index)
    plt.title('Top 10 Countries with the Highest Average Wage Gap', fontsize=16)
    plt.xlabel('Average Wage Gap (%)')
    plt.ylabel('Country')
    plt.show()

    print("Visual analysis complete.\n")
    print("\n" + "~"*50 + "\n")

    print("Finally, let's run a formal hypothesis test to confirm our findings.")
    print("Our core question: Is the wage gap we're seeing real, or just random chance?")
    
    print("Null Hypothesis (H₀): The true average wage gap is zero.")
    print("Alternative Hypothesis (Hₐ): The true average wage gap is not zero.\n")

    wage_gap_series = clean_df['wage_gap_percent']
    t_stat, p_val = stats.ttest_1samp(a=wage_gap_series, popmean=0)

    print(f"Calculated T-statistic: {t_stat:.4f}")
    print(f"Calculated P-value: {p_val:.10f}\n")

    alpha = 0.05
    print(f"Our standard for significance (alpha) is {alpha}.\n")

    print("--- Final Verdict ---")
    if p_val < alpha:
        print("Conclusion: We REJECT the null hypothesis.")
        print("The p-value is extremely small, providing strong evidence that the gender wage gap is statistically significant and not a result of random chance.")
    else:
        print("Conclusion: We FAIL to reject the null hypothesis.")
        print("The data does not provide enough statistical evidence to say the gender wage gap is different from zero.")

data_file_path = r"C:\Users\Sourav\Downloads\archive (1)\gendergapinaverage new.csv"
analyze_wage_gap(data_file_path)

