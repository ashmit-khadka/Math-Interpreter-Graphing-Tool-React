using Newtonsoft.Json;
using System;
using System.IO;

namespace Interpreter.Models
{
    /// Class allows for importing custom settings for the Interpreter
    public class Config
    {
        public int MAX_TOKENS { get; set; } //Sets the maximum number of tokens the lexer will define
        public double ErrorMargin { get; set; } //Sets the error margin for the newton raphson f# implementation
        public int Seed { get; set; } //Sets the seed for the for the newton raphson f# implementation

        /// <summary>
        /// Creates an object with default values if a config file is found
        /// it will load those settings otherwise it will save the default values
        /// for later use.
        /// </summary>
        public Config()
        {
            this.MAX_TOKENS = 50;
            this.ErrorMargin = 0.0001;
            this.Seed = 0;

            SetSettings();
        }

        /// <summary>
        /// Loads the settings from "config.json" in the relative folder to the executable
        /// if file is not found it makes one with default values.
        /// </summary>
        public void SetSettings()
        {
            try
            {
                dynamic config = JsonConvert.DeserializeObject(File.ReadAllText("config.json"));

                int i = 0;

                // only three inputs due to the three settings
                foreach (double d in config)
                {
                    if (i == 0)
                    {
                        MAX_TOKENS = int.Parse(d.ToString());
                        i++;
                    }

                    else if (i == 1)
                    {
                        ErrorMargin = d;
                        i++;
                    }

                    else if (i == 2)
                    {
                        Seed = int.Parse(d.ToString());
                        i++;
                    }
                }
            }
            //If any exception is found it will use the default settings from the start
            // of the init and will override or write a new deafult json file.
            catch (Exception)
            {
                File.WriteAllText("config.json", JsonConvert.SerializeObject(this));
            }
        }
    }
}
