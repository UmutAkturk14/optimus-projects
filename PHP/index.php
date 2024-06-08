<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <?php
      $book = [
        [
         "name" => "Ghostwritten",
         "author"=> "David Mitchell",
        ],

        [
         "name" => "Number9dream",
         "author"=> "David Mitchell",
        ],

        [
          "name" => "Cloud Atlas",
          "author"=> "David Mitchell",
        ]
      ];

      function filterByAuthor($book) {
        return 'Yo.';
      }

    ?>

  <h1>
    <?php foreach ($book as $book) : ?>
      <li><?= $book["name"] ?></li>
    <?php endforeach; ?>
  </h1>

  <p><?= filterByAuthor($book) ?></p>
</body>
</html>
