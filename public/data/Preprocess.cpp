#include <iostream>
#include <fstream>
#include <sstream>
#include <map>
#include <string>
#include <vector>

using namespace std;

const map<string, string> stateFipsCodes = {
    {"AL", "01"}, {"AK", "02"}, {"AZ", "04"}, {"AR", "05"}, {"CA", "06"}, {"CO", "08"}, {"CT", "09"}, {"DE", "10"}, {"FL", "12"}, {"GA", "13"}, {"HI", "15"}, {"ID", "16"}, {"IL", "17"}, {"IN", "18"}, {"IA", "19"}, {"KS", "20"}, {"KY", "21"}, {"LA", "22"}, {"ME", "23"}, {"MD", "24"}, {"MA", "25"}, {"MI", "26"}, {"MN", "27"}, {"MS", "28"}, {"MO", "29"}, {"MT", "30"}, {"NE", "31"}, {"NV", "32"}, {"NH", "33"}, {"NJ", "34"}, {"NM", "35"}, {"NY", "36"}, {"NC", "37"}, {"ND", "38"}, {"OH", "39"}, {"OK", "40"}, {"OR", "41"}, {"PA", "42"}, {"RI", "44"}, {"SC", "45"}, {"SD", "46"}, {"TN", "47"}, {"TX", "48"}, {"UT", "49"}, {"VT", "50"}, {"VA", "51"}, {"WA", "53"}, {"WV", "54"}, {"WI", "55"}, {"WY", "56"}};

map<string, int> countAccidentsByCounty(const string &filename)
{
    map<string, int> accidentCount;
    ifstream file(filename);

    string line;
    bool firstLine = true;
    while (getline(file, line))
    {
        if (firstLine)
        {
            firstLine = false;
            continue;
        }

        stringstream ss(line);
        string field;
        vector<string> fields;

        while (getline(ss, field, ','))
        {
            fields.push_back(field);
        }

        if (fields.size() > 1)
        {
            const string &county = fields[13];
            const string &state = fields[14];
            string fipsCode = stateFipsCodes.count(state) > 0 ? stateFipsCodes.at(state) : "Unknown";

            // cout << "State: " << state << ", FIPS Code: " << fipsCode << ", County: " << county << endl;

            accidentCount[fipsCode + county]++;
        }
    }

    file.close();
    return accidentCount;
}

void writeJsonToFile(const map<string, int> &data, const string &outputFilename)
{
    ofstream outFile(outputFilename);

    outFile << "{\n";
    for (auto it = data.begin(); it != data.end(); ++it)
    {
        outFile << "  \"" << it->first << "\": " << it->second;
        if (next(it) != data.end())
        {
            outFile << ",";
        }
        outFile << "\n";
    }
    outFile << "}\n";

    outFile.close();
}

int main()
{
    string inputFilename = "US_Accidents_March23.csv";
    string outputFilename = "output.json";

    auto accidentData = countAccidentsByCounty(inputFilename);

    writeJsonToFile(accidentData, outputFilename);
    cout << "Data written to " << outputFilename << '\n';

    return 0;
}
