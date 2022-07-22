function RandomID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 25 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 25);
  };

export default RandomID;