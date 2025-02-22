#include <iostream>
#include <fstream>
#include <sstream>
#include <map>
#include <string>
#include <vector>

using namespace std;

map<string, int> countAccidentsByMonthYear(const string &filename)
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
            string startTime = fields[4];        
            string monthYear = startTime.substr(0, 7);
            accidentCount[monthYear]++;
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

int main(int argc, char* argv[])
{
    string inputFilename = (argc > 1) ? argv[1] : "US_Accidents_March23.csv";
    string outputFilename = (argc > 2) ? argv[2] : "output.json";

    auto accidentData = countAccidentsByMonthYear(inputFilename);

    writeJsonToFile(accidentData, outputFilename);
    cout << "Data written to " << outputFilename << '\n';

    return 0;
}
