import React from 'react';
import { Container, Grid, Typography, Box, Paper, Card, CardContent, CardMedia } from '@mui/material';

const NewsPage = () => {
  return (
    <Container maxWidth="lg">
      {/* News Ticker */}
      <Box sx={{ backgroundColor: '#fee', padding: '10px 0' }}>
        <Typography variant="body2" color="error" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          News Update: Ukrainian troops saw Russian soldiers swept away • Philadelphia under 'code red' alert as millions from US East Coast • Turkish lira crashes as ...
        </Typography>
      </Box>

      {/* Main Headline */}
      <Grid container spacing={4} sx={{ marginTop: 2 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia
              component="img"
              height="250"
              image="https://via.placeholder.com/600x250" // Replace with your image URL
              alt="Main headline image"
            />
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                BBC News • 10 mins ago
              </Typography>
              <Typography variant="h4" sx={{ margin: '10px 0' }}>
                People spend night on roofs and in trees after Ukraine dam breach
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hundreds of thousands of people have been left without access to normal drinking water since the breach of the Kakhovka dam, Ukraine's President Volodymyr Zelensky has said. Read More
              </Typography>
              <Typography variant="caption" display="block" sx={{ marginTop: 1 }}>
                Aug 03, 2023
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* Side News Headlines */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {["CNN News", "BBC News", "BBC News", "CNN News"].map((newsSource, index) => (
              <Card key={index} sx={{ display: 'flex', height: '100px' }}>
                <CardContent>
                  <Typography variant="subtitle1">
                    {newsSource} • 1 hour ago
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {`Sample headline text for ${newsSource}`}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Latest News */}
      <Box sx={{ marginTop: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Latest News
          </Typography>
          <Typography variant="body2" component="a" href="#" sx={{ textDecoration: 'none', color: 'inherit' }}>
            See all
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {/* News Cards */}
          {[
            { title: "F1 teams had big upgrades planned for Imola – but what happens now?", image: "https://via.placeholder.com/400x300", source: "Formula 1", time: "10 hours ago", snippet: "One of the many disruptions the Emilia Romagna Grand Prix not going ahead has caused is that of the teams' development programmes, with several squads having planned to bring big..." },
            { title: "Ukraine war: Wagner boss rubbishes Russian claims of Ukrainian casualties", image: "https://via.placeholder.com/400x300", source: "BBC News", time: "10 hours ago", snippet: "Speaking to state media, Russian Defence Minister Sergei Shoigu insisted that his forces had inflicted over 3,715 casualties on Ukraine during the attack and destroyed dozens..." },
            { title: "Brutal killings of two young girls show one of India's biggest problems is getting worse", image: "https://via.placeholder.com/400x400", source: "CNN News", time: "10 hours ago", snippet: "An even younger girl suffers a similar fate, allegedly at the hands of her own father because she and her mother wanted to sleep on the patio..." }
          ].map((newsItem, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={newsItem.image}
                  alt={newsItem.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    {newsItem.source} • {newsItem.time}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: 1 }}>
                    {newsItem.title}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {newsItem.snippet}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default NewsPage;
